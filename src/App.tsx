import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import EnedisRaccordement from "./pages/EnedisRaccordement";
import Merci from "./pages/Merci";
import APropos from "./pages/APropos";
import Contact from "./pages/Contact";
import MentionsLegales from "./pages/MentionsLegales";
import Confidentialite from "./pages/Confidentialite";
import MaisonNeuve from "./pages/MaisonNeuve";
import Photovoltaique from "./pages/Photovoltaique";
import ModificationBranchement from "./pages/ModificationBranchement";
import RaccordementIndustriel from "./pages/RaccordementIndustriel";
import RaccordementChantier from "./pages/RaccordementChantier";
import ServiceExpress from "./pages/ServiceExpress";
import Estimation from "./pages/Estimation";
import CGU from "./pages/CGU";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/raccordement-enedis" element={<EnedisRaccordement />} />
          <Route path="/enedis-raccordement" element={<Navigate to="/raccordement-enedis" replace />} />
          <Route path="/commencer" element={<Navigate to="/raccordement-enedis" replace />} />
          <Route path="/merci" element={<Merci />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/confidentialite" element={<Confidentialite />} />
          <Route path="/maison-neuve" element={<MaisonNeuve />} />
          <Route path="/photovoltaique" element={<Photovoltaique />} />
          <Route path="/modification-branchement" element={<ModificationBranchement />} />
          <Route path="/raccordement-industriel" element={<RaccordementIndustriel />} />
          <Route path="/raccordement-chantier" element={<RaccordementChantier />} />
          <Route path="/service-express" element={<ServiceExpress />} />
          <Route path="/estimation" element={<Estimation />} />
          <Route path="/cgu" element={<CGU />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
