"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/__api__/auth";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

//decode tokens
const decodeToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return {
      username: decoded.username,
      role: decoded.role,
    };
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check auth status on initial load
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const userData = decodeToken(token);
        // Check if userData is not null
        if (userData && userData.username && userData.role) {
          setUser({
            username: userData.username,
            role: userData.role,
          });
        } else {
          console.error("Invalid token data");
          localStorage.removeItem("access_token");
        }
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("access_token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.login(credentials);
      localStorage.setItem("access_token", response.accessToken);
      const userData = {
        id: response.id,
        username: response.username,
        role: response.role,
      };
      setUser(userData);
      redirectBasedOnRole(userData.role);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    router.push("/login");
  };

  const redirectBasedOnRole = (role) => {
    const routes = {
      ADMIN: "/admin/dashboard",
      MANAGER: "/manager/projects",
      MEMBER: "/",
    };
    router.push(routes[role] || "/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
