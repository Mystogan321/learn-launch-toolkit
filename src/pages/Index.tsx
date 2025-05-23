
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the dashboard
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-kombee-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-kombee-text">Loading Kombee LMS...</h1>
      </div>
    </div>
  );
};

export default Index;
