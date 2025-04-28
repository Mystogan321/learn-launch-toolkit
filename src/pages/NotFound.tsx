
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-kombee-background">
      <div className="kombee-card text-center max-w-md w-full shadow-lg">
        <div className="mb-6 bg-muted rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <span className="text-4xl font-bold text-primary">404</span>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-kombee-text">Page Not Found</h1>
        <p className="text-muted-foreground mb-6">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Button asChild className="bg-primary text-white hover:bg-primary/90">
          <Link to="/" className="flex items-center gap-2">
            <Home size={18} />
            Return to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
