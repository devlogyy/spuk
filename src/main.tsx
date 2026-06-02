import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { AuthProvider } from "./hooks/useAuth";
import "./styles.css";

import { ConsentProvider } from "./hooks/useConsent";

const queryClient = new QueryClient();

// AdSense script is loaded lazily by <AdSlot /> only after the user grants ads consent.

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
