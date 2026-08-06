import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";

/** Loaded lazily so the ~54 kB auth/database client stays off the critical path. */
const loadSupabase = () => import("@/integrations/supabase/client").then((m) => m.supabase);

interface AuthCtx {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({
  user: null,
  session: null,
  isAdmin: false,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    const start = async () => {
      const supabase = await loadSupabase();
      if (cancelled) return;
      const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setTimeout(async () => {
          const { data } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", s.user.id)
            .eq("role", "admin")
            .maybeSingle();
          setIsAdmin(!!data);
        }, 0);
      } else {
        setIsAdmin(false);
      }
      });
      unsubscribe = () => sub.subscription.unsubscribe();

      supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
      if (s?.user) {
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", s.user.id)
          .eq("role", "admin")
          .maybeSingle()
          .then(({ data }) => setIsAdmin(!!data));
        }
      });
    };

    // Nothing on the public site needs auth. Only boot the client when a stored
    // session exists or the visitor is on an auth-gated route, so the 200 kB
    // database chunk never lands on a first-time visitor's main thread.
    const needsAuth =
      /^\/(auth|admin)/.test(window.location.pathname) ||
      Object.keys(localStorage).some((k) => k.startsWith("sb-") && k.endsWith("-auth-token"));
    if (!needsAuth) {
      setLoading(false);
      return;
    }

    const idle = (cb: () => void) => {
      const w = window as unknown as { requestIdleCallback?: (c: () => void, o?: object) => number };
      if (typeof w.requestIdleCallback === "function") w.requestIdleCallback(cb, { timeout: 3000 });
      else setTimeout(cb, 400);
    };
    idle(() => void start());

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const signOut = async () => {
    const supabase = await loadSupabase();
    await supabase.auth.signOut();
  };

  return (
    <Ctx.Provider value={{ user, session, isAdmin, loading, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
