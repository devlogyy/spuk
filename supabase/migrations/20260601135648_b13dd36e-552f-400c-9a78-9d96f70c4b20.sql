
-- Roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- User roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users see own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email) VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Page views
CREATE TABLE public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL,
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referrer TEXT,
  user_agent TEXT,
  country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.page_views TO anon, authenticated;
GRANT SELECT ON public.page_views TO authenticated;
GRANT ALL ON public.page_views TO service_role;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone insert pv" ON public.page_views FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin select pv" ON public.page_views FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX idx_pv_created ON public.page_views (created_at DESC);
CREATE INDEX idx_pv_path ON public.page_views (path);

-- Page sessions
CREATE TABLE public.page_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  path TEXT NOT NULL,
  entered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  left_at TIMESTAMPTZ,
  duration_ms INTEGER,
  max_scroll_pct INTEGER DEFAULT 0
);
GRANT INSERT, UPDATE ON public.page_sessions TO anon, authenticated;
GRANT SELECT ON public.page_sessions TO authenticated;
GRANT ALL ON public.page_sessions TO service_role;
ALTER TABLE public.page_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone insert ps" ON public.page_sessions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anyone update own ps" ON public.page_sessions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin select ps" ON public.page_sessions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX idx_ps_path ON public.page_sessions (path);
CREATE INDEX idx_ps_entered ON public.page_sessions (entered_at DESC);

-- Ad zones
CREATE TABLE public.ad_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  page_path TEXT NOT NULL,
  position TEXT NOT NULL,
  ad_slot_id TEXT,
  enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ad_zones TO anon, authenticated;
GRANT ALL ON public.ad_zones TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.ad_zones TO authenticated;
ALTER TABLE public.ad_zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone read zones" ON public.ad_zones FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin write zones" ON public.ad_zones FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Ad events
CREATE TABLE public.ad_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id UUID REFERENCES public.ad_zones(id) ON DELETE CASCADE,
  zone_key TEXT NOT NULL,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.ad_events TO anon, authenticated;
GRANT SELECT ON public.ad_events TO authenticated;
GRANT ALL ON public.ad_events TO service_role;
ALTER TABLE public.ad_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone insert ae" ON public.ad_events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin select ae" ON public.ad_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX idx_ae_zone ON public.ad_events (zone_key);
CREATE INDEX idx_ae_created ON public.ad_events (created_at DESC);

-- Seed zones
INSERT INTO public.ad_zones (key, page_path, position) VALUES
  ('home-hero', '/', 'hero'),
  ('home-inline', '/', 'inline'),
  ('scrabble-results-top', '/scrabble-solver', 'results-top'),
  ('scrabble-results-inline', '/scrabble-solver', 'results-inline'),
  ('crossword-results-top', '/crossword-solver', 'results-top'),
  ('crossword-results-inline', '/crossword-solver', 'results-inline'),
  ('wordfinder-results-top', '/word-finder', 'results-top'),
  ('blog-inline', '/blog', 'inline'),
  ('footer', '*', 'footer');

-- Engagement recommendations view
CREATE OR REPLACE VIEW public.v_zone_recommendations AS
SELECT
  z.id, z.key, z.page_path, z.position, z.enabled,
  COALESCE(s.avg_duration_ms, 0) AS avg_duration_ms,
  COALESCE(s.avg_scroll_pct, 0) AS avg_scroll_pct,
  COALESCE(s.views, 0) AS views,
  COALESCE(s.avg_duration_ms, 0) * COALESCE(s.avg_scroll_pct, 0) AS engagement_score
FROM public.ad_zones z
LEFT JOIN (
  SELECT path,
    AVG(duration_ms)::INTEGER AS avg_duration_ms,
    AVG(max_scroll_pct)::INTEGER AS avg_scroll_pct,
    COUNT(*)::INTEGER AS views
  FROM public.page_sessions
  WHERE duration_ms IS NOT NULL
  GROUP BY path
) s ON s.path = z.page_path;

GRANT SELECT ON public.v_zone_recommendations TO authenticated;
