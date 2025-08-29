import React, { useEffect } from 'react'
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import Footer from "./components/layout/Footer";
import Test from './pages/Test';
import CreateOrgPage from './pages/CreateOrgPage';
import AdmitToOrgPage from './pages/AdmitToOrg';
import ManageMembersPage from './pages/ManageMembersPage';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


const queryClient = new QueryClient();


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading , user} = useAuth();
  console.log('isAuthenticated isLoading', isAuthenticated, isLoading);
  const location = useLocation();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={"/login?redirect=" + encodeURIComponent(location.pathname)} />
    
  }
  
  if (user && !user.organization) {
    return <Navigate to={"/create-org?redirect=" + encodeURIComponent(location.pathname)} />
  }

  return <>{children}</>;
};

const AppRoutes = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/upload" 
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create-org" 
          element={
            // <ProtectedRoute> // TODO  
              <CreateOrgPage />
            // </ProtectedRoute>
          } 
        />
        <Route 
          path="/manage-members" 
          element={
            <ProtectedRoute>
              <ManageMembersPage />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </AuthProvider>
  </BrowserRouter>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="streamforge-theme">
    <ReactQueryDevtools initialIsOpen={false} />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
