CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.is_admin_user(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'::public.app_role
  )
$$;

REVOKE ALL ON FUNCTION private.is_admin_user(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.is_admin_user(uuid) FROM anon;
GRANT USAGE ON SCHEMA private TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_admin_user(uuid) TO authenticated;

DROP POLICY IF EXISTS "admin select ae" ON public.ad_events;
CREATE POLICY "admin select ae" ON public.ad_events
FOR SELECT TO authenticated
USING (private.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "admin write zones" ON public.ad_zones;
CREATE POLICY "admin write zones" ON public.ad_zones
FOR ALL TO authenticated
USING (private.is_admin_user(auth.uid()))
WITH CHECK (private.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "admin select ps" ON public.page_sessions;
CREATE POLICY "admin select ps" ON public.page_sessions
FOR SELECT TO authenticated
USING (private.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "admin select pv" ON public.page_views;
CREATE POLICY "admin select pv" ON public.page_views
FOR SELECT TO authenticated
USING (private.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "admins manage ad settings" ON public.site_settings;
CREATE POLICY "admins manage ad settings" ON public.site_settings
FOR ALL TO authenticated
USING (private.is_admin_user(auth.uid()))
WITH CHECK (private.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "admins manage roles" ON public.user_roles;
CREATE POLICY "admins manage roles" ON public.user_roles
FOR ALL TO authenticated
USING (private.is_admin_user(auth.uid()))
WITH CHECK (private.is_admin_user(auth.uid()));

DROP FUNCTION IF EXISTS public.is_admin_user(uuid);