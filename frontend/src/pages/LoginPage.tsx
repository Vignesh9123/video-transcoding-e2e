
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const {pathname} = useLocation()

  useEffect(() => {
    if (isAuthenticated) {
      if (user && user.organization && pathname == "/login") {
        navigate("/dashboard");
      }
      else {
        navigate("/create-org");
      }
    }
  }, [isAuthenticated, navigate, pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary"
              >
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              <span className="font-bold text-xl">StreamForge</span>
            </Link>
          </div>
          <div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center flex-grow px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to StreamForge</h1>
          <p className="text-muted-foreground">
            Sign in to manage and transcode your videos
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
