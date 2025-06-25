import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "./LoginForm";
import { UserRole } from "@/lib/types";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  fallback?: ReactNode;
}

const ProtectedRoute = ({
  children,
  allowedRoles,
  fallback,
}: ProtectedRouteProps) => {
  const { currentUser, login, register, error, isLoading } = useAuth();

  // If no user is logged in, show login form
  if (!currentUser) {
    return (
      <LoginForm
        onLogin={login}
        onRegister={register}
        error={error}
        loading={isLoading}
      />
    );
  }

  // If user is logged in but doesn't have required role
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return (
      fallback || (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-foreground">
              Accès non autorisé
            </h1>
            <p className="text-muted-foreground">
              Vous n'avez pas les permissions nécessaires pour accéder à cette
              page.
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      )
    );
  }

  // User is authorized, render children
  return <>{children}</>;
};

export default ProtectedRoute;
