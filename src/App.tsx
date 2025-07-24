import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "./components/ui/error-boundary";
import MobileDetector from "./components/MobileDetector";
import { AccessibilityProvider } from "./components/AccessibilityProvider";
import ServiceWorker from "./components/ServiceWorker";

// Direct imports - no lazy loading
import OptimizedHomePage from "./pages/OptimizedHomePage";
import MobileHomePage from "./pages/MobileHomePage";
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
import Admin from "./pages/Admin";
import AdminLeadDetail from "./pages/AdminLeadDetail";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { AdminProvider } from "./contexts/AdminContext";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentSuccessOptimized from "./pages/PaymentSuccessOptimized";
import PaymentCancel from "./pages/PaymentCancel";

// Simple loading component without animation
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-foreground">Chargement...</div>
  </div>
);

const queryClient = new QueryClient();

const AppContent = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <MobileDetector>
            {({ isMobile }) => isMobile ? 
              <MobileHomePage /> : 
              <OptimizedHomePage />
            }
          </MobileDetector>
        } />
        <Route path="/raccordement-enedis" element={<EnedisRaccordement />} />
        <Route path="/enedis-raccordement" element={<Navigate to="/raccordement-enedis" replace />} />
        <Route path="/commencer" element={<Navigate to="/raccordement-enedis" replace />} />
        <Route path="/merci" element={<PaymentSuccessOptimized />} />
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
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/admin/leads/:id" element={<ProtectedRoute><AdminLeadDetail /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AccessibilityProvider>
      <TooltipProvider>
        <AdminProvider>
          <ServiceWorker />
          <Toaster />
          <Sonner />
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </AdminProvider>
      </TooltipProvider>
    </AccessibilityProvider>
  </QueryClientProvider>
);

export default App;