
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Shield } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-kombee-background">
      <div className="kombee-card text-center max-w-md w-full shadow-lg">
        <div className="mb-6 bg-muted rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <Shield className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-kombee-text">Access Denied</h1>
        <p className="text-muted-foreground mb-4">
          Sorry, you don't have permission to access this page.
        </p>
        <p className="mb-6 text-sm bg-secondary p-3 rounded-md">
          Your current role: <span className="font-semibold">{user?.role || 'Unknown'}</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
          <Button onClick={() => navigate("/dashboard")} className="kombee-btn-primary">
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
