// Détecter l'environnement et configurer l'URL de l'API en conséquence
const isLocalDev =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");
const API_BASE_URL =
  import.meta.env.VITE_API_URL || (isLocalDev ? "/api" : "/api");

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;
  private fallbackMode: boolean = false;
  private backendChecked: boolean = false;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadToken();
    // Ne pas vérifier le backend dans le constructeur pour éviter les erreurs
    // La vérification se fera lors de la première requête
  }

  private async checkBackendAvailability() {
    if (this.backendChecked) return;

    const isLocalDev =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    // Si nous ne sommes pas en développement local et qu'il n'y a pas d'URL d'API configurée,
    // utiliser directement le mode fallback
    if (!isLocalDev && !this.baseURL) {
      console.log(
        "🌍 Environment detected: Cloud/Preview - Using fallback mode",
      );
      this.fallbackMode = true;
      this.backendChecked = true;
      return;
    }

    // En environnement cloud, passer directement en mode fallback sans essayer de fetch
    if (!isLocalDev) {
      console.log(
        "🌍 Cloud environment detected - Using fallback mode directly",
      );
      this.fallbackMode = true;
      this.backendChecked = true;
      return;
    }

    try {
      console.log("🔍 Checking backend availability...");
      console.log("🔗 Environment: Local Development");
      console.log("🔗 API Base URL:", this.baseURL);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch("/health", {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      this.fallbackMode = !response.ok;

      if (this.fallbackMode) {
        console.warn(
          "⚠️ Backend not available, using fallback localStorage mode",
        );
      } else {
        console.log("✅ Backend is available and ready");
      }
    } catch (error) {
      console.warn(
        "⚠️ Local backend not available, switching to fallback mode",
      );
      this.fallbackMode = true;
    } finally {
      this.backendChecked = true;
    }
  }

  private loadToken() {
    this.token = localStorage.getItem("votesecure_token");
  }

  private saveToken(token: string) {
    this.token = token;
    localStorage.setItem("votesecure_token", token);
  }

  private removeToken() {
    this.token = null;
    localStorage.removeItem("votesecure_token");
    localStorage.removeItem("votesecure_user");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    await this.checkBackendAvailability();

    if (this.fallbackMode) {
      throw new Error("Backend not available, using fallback mode");
    }

    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);

      // Si c'est une erreur de réseau, forcer le mode fallback
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.warn("🔄 Network error detected, forcing fallback mode");
        this.fallbackMode = true;
      }

      throw error;
    }
  }

  // Auth methods
  async login(credentials: { email: string; password: string; role: string }) {
    console.log("🔐 API Login attempt for:", credentials.email);

    try {
      if (!this.fallbackMode) {
        console.log("🌐 Trying API login...");
        const response = await this.request<{
          user: any;
          token: string;
        }>("/auth/login", {
          method: "POST",
          body: JSON.stringify(credentials),
        });

        if (response.token) {
          this.saveToken(response.token);
          localStorage.setItem(
            "votesecure_user",
            JSON.stringify(response.user),
          );
        }

        console.log("✅ API login successful");
        return response;
      }
    } catch (error) {
      console.warn("⚠️ API login failed, falling back to localStorage mode");
      this.fallbackMode = true;
    }

    console.log("💾 Using fallback login...");
    return this.loginFallback(credentials);
  }

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  }) {
    console.log("📝 API Register attempt for:", data.email);

    try {
      if (!this.fallbackMode) {
        console.log("🌐 Trying API registration...");
        const response = await this.request<{
          message: string;
          userId: string;
        }>("/auth/register", {
          method: "POST",
          body: JSON.stringify(data),
        });
        console.log("✅ API registration successful");
        return response;
      }
    } catch (error) {
      console.warn(
        "⚠️ API registration failed, falling back to localStorage mode",
      );
      this.fallbackMode = true;
    }

    console.log("💾 Using fallback registration...");
    return this.registerFallback(data);
  }

  async getCurrentUser() {
    if (this.fallbackMode) {
      const user = this.getStoredUser();
      if (user) {
        return { user };
      }
      throw new Error("No user found");
    }

    return this.request<{ user: any }>("/auth/me");
  }

  logout() {
    this.removeToken();
  }

  // Users methods
  async getVoters() {
    if (this.fallbackMode) {
      const users = JSON.parse(
        localStorage.getItem("votesecure_fallback_users") || "[]",
      );

      const voters = users.filter(
        (u: any) => u.role === "voter" || u.role === "candidate",
      );
      return { users: voters };
    }
    return this.request<{ users: any[] }>("/users/voters");
  }

  async getAllUsers() {
    return this.request<{ users: any[] }>("/users/all");
  }

  async getUserStats() {
    return this.request<{ stats: any }>("/users/stats");
  }

  async updateUserStatus(userId: string, status: string) {
    if (this.fallbackMode) {
      const users = JSON.parse(
        localStorage.getItem("votesecure_fallback_users") || "[]",
      );
      const updatedUsers = users.map((u: any) =>
        u.id === userId ? { ...u, status } : u,
      );
      localStorage.setItem(
        "votesecure_fallback_users",
        JSON.stringify(updatedUsers),
      );
      console.log(
        `✅ Updated user ${userId} status to ${status} (fallback mode)`,
      );
      return { message: "Statut mis à jour" };
    }
    return this.request<{ message: string }>(`/users/${userId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  async deleteUser(userId: string) {
    return this.request<{ message: string }>(`/users/${userId}`, {
      method: "DELETE",
    });
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Get stored user data
  getStoredUser() {
    const userData = localStorage.getItem("votesecure_user");
    return userData ? JSON.parse(userData) : null;
  }

  // Fallback methods for when backend is not available - SENEGALESE VERSION
  private async loginFallback(credentials: {
    email: string;
    password: string;
    role: string;
  }) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check predefined test accounts - SENEGALESE ACCOUNTS
    const testAccounts: Record<string, { password: string; user: any }> = {
      "admin@votesecure.sn": {
        password: "admin123",
        user: {
          id: "admin_1",
          email: "admin@votesecure.sn",
          firstName: "Admin",
          lastName: "System",
          role: "admin",
          status: "approved",
        },
      },
      "aissatou.diop@email.sn": {
        password: "candidate123",
        user: {
          id: "candidate_1",
          email: "aissatou.diop@email.sn",
          firstName: "Aissatou",
          lastName: "Diop",
          role: "candidate",
          status: "approved",
        },
      },
      "mamadou.fall@email.sn": {
        password: "voter123",
        user: {
          id: "voter_1",
          email: "mamadou.fall@email.sn",
          firstName: "Mamadou",
          lastName: "Fall",
          role: "voter",
          status: "approved",
        },
      },
      "fatou.sarr@email.sn": {
        password: "spectator123",
        user: {
          id: "spectator_1",
          email: "fatou.sarr@email.sn",
          firstName: "Fatou",
          lastName: "Sarr",
          role: "spectator",
          status: "approved",
        },
      },
    };

    // First check if it's a predefined account
    const account = testAccounts[credentials.email];
    if (
      account &&
      account.password === credentials.password &&
      account.user.role === credentials.role
    ) {
      const token = "fallback-token-" + Date.now();
      this.saveToken(token);
      localStorage.setItem("votesecure_user", JSON.stringify(account.user));
      console.log("✅ Fallback login successful for predefined account");
      return { user: account.user, token };
    }

    // Then check for newly registered users from fallback storage
    const fallbackUsers = JSON.parse(
      localStorage.getItem("votesecure_fallback_users") || "[]",
    );
    const fallbackUser = fallbackUsers.find(
      (u: any) => u.email === credentials.email && u.role === credentials.role,
    );

    if (fallbackUser) {
      // Check stored password
      const passwords = JSON.parse(
        localStorage.getItem("votesecure_fallback_passwords") || "{}",
      );
      if (passwords[credentials.email] !== credentials.password) {
        throw new Error("Identifiants incorrects");
      }

      if (fallbackUser.status === "pending") {
        throw new Error(
          "Compte en attente de validation par un administrateur",
        );
      }
      if (
        fallbackUser.status === "rejected" ||
        fallbackUser.status === "blocked"
      ) {
        throw new Error("Compte non autorisé");
      }

      const token = "fallback-token-" + Date.now();
      this.saveToken(token);
      localStorage.setItem("votesecure_user", JSON.stringify(fallbackUser));
      console.log("✅ Fallback login successful for registered user");
      return { user: fallbackUser, token };
    }

    throw new Error("Identifiants incorrects");
  }

  private async registerFallback(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  }) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get existing users from localStorage
    const existingUsers = JSON.parse(
      localStorage.getItem("votesecure_fallback_users") || "[]",
    );

    // Check if email exists
    if (existingUsers.find((u: any) => u.email === data.email)) {
      throw new Error("Cette adresse email est déjà utilisée");
    }

    // Add new user
    const newUser = {
      id: `user_${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      status: data.role === "admin" ? "approved" : "pending",
      createdAt: new Date().toISOString(),
    };

    existingUsers.push(newUser);
    localStorage.setItem(
      "votesecure_fallback_users",
      JSON.stringify(existingUsers),
    );

    // Store password separately
    const passwords = JSON.parse(
      localStorage.getItem("votesecure_fallback_passwords") || "{}",
    );
    passwords[data.email] = data.password;
    localStorage.setItem(
      "votesecure_fallback_passwords",
      JSON.stringify(passwords),
    );

    console.log("✅ Fallback registration successful");
    return {
      message:
        "Inscription réussie ! Votre compte sera validé par un administrateur.",
      userId: newUser.id,
    };
  }
}

// Créer l'instance de l'API client de manière sûre
let apiClientInstance: ApiClient | null = null;

export const apiClient = (() => {
  if (!apiClientInstance) {
    try {
      apiClientInstance = new ApiClient(API_BASE_URL || "/api");
    } catch (error) {
      console.warn("Failed to initialize API client, using fallback mode");
      // Créer une instance en mode fallback
      apiClientInstance = new ApiClient("/api");
      (apiClientInstance as any).fallbackMode = true;
      (apiClientInstance as any).backendChecked = true;
    }
  }
  return apiClientInstance;
})();

export default apiClient;
