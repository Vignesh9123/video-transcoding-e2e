
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import axios from 'axios';

interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (idtoken: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const mockUsers: AuthUser[] = [
  { id: '1', email: 'user@example.com', name: 'Demo User' }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();


  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/auth/current-user", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      setUser(response.data.user);
    } catch (error) {
        setUser(null);
        localStorage.removeItem("token");
    }
  }
  useEffect(() => {
    getUser();
    setIsLoading(false);
  }, []);
  const login = async (idtoken: string): Promise<void> => {
    setIsLoading(true);
    try {
      const userData = {
        idtoken
      };
      const signInPromise = axios
        .post(
          "http://localhost:3000/api/auth/google-login",
          userData,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        )
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          setUser(response.data.user);
          navigate("/dashboard");

        });

      toast.promise(signInPromise, {
        loading: "Signing in...",
        success: "Signed in successfully!",
        error: "Failed to sign in. Please try again.",
      });

    } catch (error) {
      if (error.status === 429) {
        toast.error("Too Many Requests - please try again later");
        navigate("/");
        return;
      }
      toast.error("Failed to sign in. Please try again.");
      return;
    }
    finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newUser = { id: Date.now().toString(), email, name };
      setUser(newUser);
      localStorage.setItem('transcodeUser', JSON.stringify(newUser));
      toast.success("Account created successfully!");
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.get("http://localhost:3000/api/auth/logout", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      withCredentials: true
    })
    setUser(null);
    localStorage.removeItem("token");
    toast.success("Logged out successfully.");
    navigate('/');
    } catch (error) {
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
