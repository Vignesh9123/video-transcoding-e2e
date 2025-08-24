import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
const LoginForm = () => {
  const { login, isLoading } = useAuth();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const redirectParam = searchParams.get("redirect")?.trim()
      const nextPath = redirectParam?.length > 0 ? redirectParam : undefined;
      await login(nextPath);
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
        <CardDescription>
          Sign in to your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Sign in with Google"}
        </Button>
      </form>
    </Card>
  );
};

export default LoginForm;
