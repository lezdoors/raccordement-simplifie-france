import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import MobileDetector from "./components/MobileDetector";

// Lazy load all pages for better performance
const HomePage = lazy(() => import("./pages/HomePage"));
const MobileHomePage = lazy(() => import("./pages/MobileHomePage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const EnedisRaccordement = lazy(() => import("./pages/EnedisRaccordement"));
const Merci = lazy(() => import("./pages/Merci"));
const APropos = lazy(() => import("./pages/APropos"));
const Contact = lazy(() => import("./pages/Contact"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales"));
const Confidentialite = lazy(() => import("./pages/Confidentialite"));
const MaisonNeuve = lazy(() => import("./pages/MaisonNeuve"));
const Photovoltaique = lazy(() => import("./pages/Photovoltaique"));
const ModificationBranchement = lazy(() => import("./pages/ModificationBranchement"));
const RaccordementIndustriel = lazy(() => import("./pages/RaccordementIndustriel"));
const RaccordementChantier = lazy(() => import("./pages/RaccordementChantier"));
const ServiceExpress = lazy(() => import("./pages/ServiceExpress"));
const Estimation = lazy(() => import("./pages/Estimation"));
const CGU = lazy(() => import("./pages/CGU"));
const Admin = lazy(() => import("./pages/Admin"));
const Login = lazy(() => import("./pages/Login"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentCancel = lazy(() => import("./pages/PaymentCancel"));

// Loading component for suspense fallbacks
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ErrorBoundary>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={
                <MobileDetector>
                  {({ isMobile }) => isMobile ? 
                    <Suspense fallback={<PageLoader />}><MobileHomePage /></Suspense> : 
                    <Suspense fallback={<PageLoader />}><HomePage /></Suspense>
                  }
                </MobileDetector>
              } />
              <Route path="/raccordement-enedis" element={
                <Suspense fallback={<PageLoader />}><EnedisRaccordement /></Suspense>
              } />
              <Route path="/enedis-raccordement" element={<Navigate to="/raccordement-enedis" replace />} />
              <Route path="/commencer" element={<Navigate to="/raccordement-enedis" replace />} />
              <Route path="/merci" element={
                <Suspense fallback={<PageLoader />}><Merci /></Suspense>
              } />
              <Route path="/a-propos" element={
                <Suspense fallback={<PageLoader />}><APropos /></Suspense>
              } />
              <Route path="/contact" element={
                <Suspense fallback={<PageLoader />}><Contact /></Suspense>
              } />
              <Route path="/mentions-legales" element={
                <Suspense fallback={<PageLoader />}><MentionsLegales /></Suspense>
              } />
              <Route path="/confidentialite" element={
                <Suspense fallback={<PageLoader />}><Confidentialite /></Suspense>
              } />
              <Route path="/maison-neuve" element={
                <Suspense fallback={<PageLoader />}><MaisonNeuve /></Suspense>
              } />
              <Route path="/photovoltaique" element={
                <Suspense fallback={<PageLoader />}><Photovoltaique /></Suspense>
              } />
              <Route path="/modification-branchement" element={
                <Suspense fallback={<PageLoader />}><ModificationBranchement /></Suspense>
              } />
              <Route path="/raccordement-industriel" element={
                <Suspense fallback={<PageLoader />}><RaccordementIndustriel /></Suspense>
              } />
              <Route path="/raccordement-chantier" element={
                <Suspense fallback={<PageLoader />}><RaccordementChantier /></Suspense>
              } />
              <Route path="/service-express" element={
                <Suspense fallback={<PageLoader />}><ServiceExpress /></Suspense>
              } />
              <Route path="/estimation" element={
                <Suspense fallback={<PageLoader />}><Estimation /></Suspense>
              } />
              <Route path="/cgu" element={
                <Suspense fallback={<PageLoader />}><CGU /></Suspense>
              } />
              <Route path="/payment-success" element={
                <Suspense fallback={<PageLoader />}><PaymentSuccess /></Suspense>
              } />
              <Route path="/payment-cancel" element={
                <Suspense fallback={<PageLoader />}><PaymentCancel /></Suspense>
              } />
              <Route path="/admin" element={
                <Suspense fallback={<PageLoader />}>
                  <ProtectedRoute><Admin /></ProtectedRoute>
                </Suspense>
              } />
              <Route path="/login" element={
                <Suspense fallback={<PageLoader />}><Login /></Suspense>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={
                <Suspense fallback={<PageLoader />}><NotFound /></Suspense>
              } />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
