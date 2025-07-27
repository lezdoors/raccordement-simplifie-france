import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "./components/ui/error-boundary";
import { AccessibilityProvider } from "./components/AccessibilityProvider";
import ServiceWorker from "./components/ServiceWorker";

// Direct imports - no lazy loading
import OptimizedHomePage from "./pages/OptimizedHomePage";
import NotFound from "./pages/NotFound";
import EnedisRaccordement from "./pages/EnedisRaccordement";
import Commencer from "./pages/Commencer";
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
import Protected from "./pages/Protected";
import AuthTest from "./pages/AuthTest";
import Blog from "./pages/Blog";
import FAQ from "./pages/FAQ";
import { MobileOptimizations } from "./components/mobile/MobileOptimizations";
import { MobilePerformanceProvider } from "./components/mobile/MobilePerformanceProvider";

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
      <div className="mobile-safe-bottom">
        <Routes>
        <Route path="/" element={<OptimizedHomePage />} />
        <Route path="/raccordement-enedis" element={<Commencer />} />
        <Route path="/commencer" element={<Navigate to="/raccordement-enedis" replace />} />
        <Route path="/enedis-raccordement" element={<Navigate to="/raccordement-enedis" replace />} />
        <Route path="/merci" element={<Merci />} />
        <Route path="/a-propos" element={<APropos />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/confidentialite" element={<Confidentialite />} />
        <Route path="/maison-neuve" element={<MaisonNeuve />} />
        <Route path="/raccordement-maison-neuve" element={<Navigate to="/maison-neuve" replace />} />
        <Route path="/photovoltaique" element={<Photovoltaique />} />
        <Route path="/raccordement-photovoltaique" element={<Navigate to="/photovoltaique" replace />} />
        <Route path="/modification-branchement" element={<ModificationBranchement />} />
        <Route path="/raccordement-industriel" element={<RaccordementIndustriel />} />
        <Route path="/raccordement-chantier" element={<RaccordementChantier />} />
        <Route path="/service-express" element={<ServiceExpress />} />
        <Route path="/estimation" element={<Estimation />} />
        <Route path="/estimation-couts" element={<Navigate to="/estimation" replace />} />
        <Route path="/cgu" element={<CGU />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="/admin/leads/:id" element={
          <ProtectedRoute>
            <AdminLeadDetail />
          </ProtectedRoute>
        } />
        <Route path="/protected" element={<Protected />} />
        <Route path="/auth-test" element={<AuthTest />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </div>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AccessibilityProvider>
      <TooltipProvider>
        <MobilePerformanceProvider>
          <AdminProvider>
            <ServiceWorker />
            <MobileOptimizations />
            <Toaster />
            <Sonner />
            <ErrorBoundary>
              <AppContent />
            </ErrorBoundary>
          </AdminProvider>
        </MobilePerformanceProvider>
      </TooltipProvider>
    </AccessibilityProvider>
  </QueryClientProvider>
);

export default App;