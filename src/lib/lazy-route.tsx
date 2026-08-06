import type { ComponentType } from "react";

type Loader = () => Promise<{ default: ComponentType<Record<string, never>> }>;

export interface PreloadableComponent {
  (props: Record<string, never>): JSX.Element;
  preload: () => Promise<void>;
}

/**
 * Like React.lazy, but once `preload()` has resolved the component renders
 * synchronously — no Suspense fallback, so hydrating a prerendered page never
 * swaps real content for a placeholder (which would register as layout shift).
 */
export function lazyRoute(loader: Loader): PreloadableComponent {
  let Loaded: ComponentType<Record<string, never>> | null = null;
  let pending: Promise<void> | null = null;

  const load = () => {
    if (!pending) {
      pending = loader().then((m) => {
        Loaded = m.default;
      });
    }
    return pending;
  };

  const Route = ((props: Record<string, never>) => {
    if (Loaded) return <Loaded {...props} />;
    throw load();
  }) as PreloadableComponent;

  Route.preload = load;
  return Route;
}
