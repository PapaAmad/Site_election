import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import AdminElections from "./pages/AdminElections";
import AdminCandidates from "./pages/AdminCandidates";
import AdminVoters from "./pages/AdminVoters";
import AdminSettings from "./pages/AdminSettings";
import VotingPage from "./pages/VotingPage";
import ResultsPage from "./pages/ResultsPage";
import CandidateDashboard from "./pages/CandidateDashboard";
import CandidateApplication from "./pages/CandidateApplication";
import NotFound from "./pages/NotFound";
import { UserRole } from "@/lib/types";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/elections"
              element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                  <AdminElections />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/candidates"
              element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                  <AdminCandidates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/voters"
              element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                  <AdminVoters />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/results"
              element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                  <ResultsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                  <AdminSettings />
                </ProtectedRoute>
              }
            />

            {/* Candidate Routes */}
            <Route
              path="/candidate/dashboard"
              element={
                <ProtectedRoute allowedRoles={[UserRole.CANDIDATE]}>
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/application"
              element={
                <ProtectedRoute allowedRoles={[UserRole.CANDIDATE]}>
                  <CandidateApplication />
                </ProtectedRoute>
              }
            />

            {/* Voter Routes */}
            <Route
              path="/vote"
              element={
                <ProtectedRoute allowedRoles={[UserRole.VOTER]}>
                  <VotingPage />
                </ProtectedRoute>
              }
            />

            {/* Public Routes - accessible to all authenticated users */}
            <Route
              path="/results"
              element={
                <ProtectedRoute>
                  <ResultsPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
