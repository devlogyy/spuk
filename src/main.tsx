import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App, { preloadRouteFor } from "./App";
import { AuthProvider } from "./hooks/useAuth";
import "./styles.css";

import { ConsentProvider } from "./hooks/useConsent";

const queryClient = new QueryClient();

// AdSense script is loaded lazily by <AdSlot /> only after the user grants ads consent.

function mount() {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ConsentProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </ConsentProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </HelmetProvider>
    </StrictMode>,
  );
}

// Resolve the current route's chunk first so the prerendered HTML is swapped
// for the live page in a single commit (no placeholder flash, no layout shift).
preloadRouteFor(window.location.pathname).then(mount, mount);
