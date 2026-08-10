import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { api, setAccessToken } from "../lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;

      api
        .post<{ accessToken: string }>("/auth/refresh")
        .then((refreshResponse) => {
          setAccessToken(refreshResponse.data.accessToken);
          return api.get<User>("/auth/me");
        })
        .then((meResponse) => {
          setUser(meResponse.data);
        })
        .catch(() => {
          setAccessToken(null);
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    function handleSessionExpired() {
      setAccessToken(null);
      setUser(null);
    }

    window.addEventListener("auth:session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, []);

  async function login(email: string, password: string) {
    const { data } = await api.post<{ accessToken: string; user: User }>(
      "/auth/login",
      { email, password },
    );
    setAccessToken(data.accessToken);
    setUser(data.user);
  }

  async function logout() {
    await api.post("/auth/logout").catch(() => undefined);
    setAccessToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de um <AuthProvider>.");
  }
  return context;
}
