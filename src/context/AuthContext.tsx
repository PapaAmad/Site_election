import React, { createContext, useContext, useState, useEffect } from "react";
import { UserRole, UserStatus, User } from "@/lib/types";
import { apiClient } from "@/lib/api";

interface AuthContextType {
  currentUser: User | null;
  login: (credentials: {
    email: string;
    password: string;
    role: UserRole;
  }) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize fallback users on load
  useEffect(() => {
    const initializeFallbackData = () => {
      const existingUsers = localStorage.getItem("votesecure_fallback_users");
      if (!existingUsers) {
        const defaultUsers = [
          {
            id: "voter_pending_1",
            email: "aminata.ndiaye@email.sn",
            firstName: "Aminata",
            lastName: "Ndiaye",
            role: "voter",
            status: "pending",
            createdAt: new Date().toISOString(),
          },
          {
            id: "voter_pending_2",
            email: "ibrahima.ba@email.sn",
            firstName: "Ibrahima",
            lastName: "Ba",
            role: "voter",
            status: "pending",
            createdAt: new Date().toISOString(),
          },
        ];
        localStorage.setItem(
          "votesecure_fallback_users",
          JSON.stringify(defaultUsers),
        );
        console.log("📝 Initialized fallback users data");
      }
    };

    initializeFallbackData();
  }, []);

  // Load user from API on mount if token exists
  useEffect(() => {
    const initializeAuth = async () => {
      console.log("🔄 Initializing authentication...");

      if (apiClient.isAuthenticated()) {
        try {
          console.log("🔑 Token found, getting current user...");
          const response = await apiClient.getCurrentUser();
          setCurrentUser(response.user);
          console.log("✅ User loaded:", response.user);
        } catch (error: any) {
          console.error("❌ Failed to load user from API:", error);
          // Try to get user from localStorage as fallback
          const savedUser = apiClient.getStoredUser();
          if (savedUser) {
            console.log("🔄 Using saved user from localStorage");
            setCurrentUser(savedUser);
          } else {
            console.log("🚪 No valid user found, logging out");
            apiClient.logout();
          }
        }
      } else {
        console.log("❌ No authentication token found");
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: {
    email: string;
    password: string;
    role: UserRole;
  }) => {
    console.log("🔐 Login attempt:", credentials.email, credentials.role);
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.login({
        email: credentials.email,
        password: credentials.password,
        role: credentials.role,
      });

      console.log("✅ Login successful:", response.user);
      setCurrentUser(response.user);
    } catch (error: any) {
      console.error("❌ Login failed:", error.message);
      setError(error.message || "Identifiants incorrects. Veuillez réessayer.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  }) => {
    console.log("📝 Registration attempt:", data.email, data.role);
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      });

      console.log("✅ Registration successful:", response.message);
      alert(
        response.message ||
          "Inscription réussie ! Votre compte sera validé par un administrateur.",
      );
    } catch (error: any) {
      console.error("❌ Registration failed:", error.message);
      setError(
        error.message || "Erreur lors de l'inscription. Veuillez réessayer.",
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log("🚪 Logging out...");
    setCurrentUser(null);
    apiClient.logout();
    window.location.href = "/";
  };

  const value: AuthContextType = {
    currentUser,
    login,
    register,
    logout,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
