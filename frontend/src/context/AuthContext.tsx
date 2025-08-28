
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { axiosClient } from '@/config/axiosConfig';
import { authClient } from '@/lib/auth-client';
import { MAIN_APP_URL } from '@/config';
interface AuthUser {
  id: string;
  email: string;
  name: string;
  roleInOrg: string;
  organization: string;
}

interface AuthContextType {
  user: AuthUser | null;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (nextPath?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();


  const getUser = async () => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get("/api/user/current-user");
      console.log('response from user', response.data);
      setUser(response.data.user);
      localStorage.setItem("token", response.data.token);
      console.log("User with data fetched", response.data.user)
    } catch (error) {
      setUser(null);
      localStorage.removeItem("token");
    }
    finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    setIsLoading(true);
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      if (!user.organization) {
        navigate("/create-org")
      }
    }
  }, [user])
  const login = async (nextPath?: string): Promise<void> => {
    setIsLoading(true);
    console.log('nextPath', nextPath);
    const redirectUrl = nextPath ? `${MAIN_APP_URL}${nextPath}` : `${MAIN_APP_URL}/dashboard`;
    console.log('redirectUrl', redirectUrl);
    try {
      const signInPromise = new Promise((resolve, reject) => authClient.signIn.social({
        provider: 'google',
        callbackURL: redirectUrl,
        fetchOptions:{
          onResponse: (response) => {
            console.log('response', response);
            if(response.response.ok){
              resolve(response);
            }
          },
          onError: (error) => {
            console.log('error', error);
            reject(error);
          }
        }
      })).finally(() => setIsLoading(false));
      toast.promise(signInPromise, {
        loading: "Signing in...",
        success: "Redirecting...",
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
  };



  const logout = async () => {
    try {
      await authClient.signOut();
      setUser(null);
      localStorage.removeItem("token");
      toast.success("Logged out successfully.");
      navigate('/login');
    } catch (error) {
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: !!user,
        isLoading,
        login,
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
