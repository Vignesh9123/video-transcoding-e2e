
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import axios from 'axios';

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
  login: (idtoken: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

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
      console.log("User with data fetched", response.data.user)
    } catch (error) {
        setUser(null);
        localStorage.removeItem("token");
    }
    finally{
      setIsLoading(false);
  }
  }
  useEffect(() => {
    setIsLoading(true);
    getUser();
  }, []);

  useEffect(()=>{
    if(user){
      if(!user.organization){
        navigate("/create-org")
      }
    }
  }, [user])
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
          if(!response.data.user.organization){
            navigate("/create-org")
          }
          else{
            navigate("/dashboard")
          }


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
