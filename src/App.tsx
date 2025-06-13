import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner"; // shadcn sonner
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import newly generated pages
import DashboardPage from "./pages/DashboardPage";
import TradePage from "./pages/TradePage";
import WalletPage from "./pages/WalletPage";
import DiscoverPage from "./pages/DiscoverPage";
import AccountPage from "./pages/AccountPage";

import NotFound from "./pages/NotFound"; // Assume NotFound.tsx exists

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner /> {/* For shadcn sonner toasts */}
      <BrowserRouter>
        <Routes>
          {/* Set DashboardPage as the index route for logged-in users */}
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/trade" element={<TradePage />} />
          {/* Optional: Route for specific trading pair */}
          {/* <Route path="/trade/:pairSymbol" element={<TradePage />} /> */}
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/account" element={<AccountPage />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} /> {/* Always Include This Line As It Is. */}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;