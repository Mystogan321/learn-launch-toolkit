
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Key, Eye, EyeOff, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: 'Login successful',
          description: 'Welcome back!',
        });
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
        toast({
          title: 'Login failed',
          description: 'Invalid email or password',
          variant: 'destructive',
        });
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-kombee-background p-4">
      <div className="max-w-md w-full kombee-card shadow-lg">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xl">K</span>
          </div>
          <h1 className="text-2xl font-bold mt-4 text-kombee-text">Login to Kombee</h1>
          <p className="text-muted-foreground mt-1">Enter your credentials to access your account</p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-kombee-text mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full"
              disabled={isLoading}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-kombee-text mb-1">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pr-10"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-kombee-text"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full kombee-btn-primary flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              "Logging in..."
            ) : (
              <>
                <LogIn size={18} />
                Login
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 bg-secondary p-4 rounded-md">
          <h3 className="text-sm font-medium text-kombee-text mb-2">Demo Accounts:</h3>
          <div className="text-sm grid grid-cols-1 gap-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Admin:</span> 
              <span className="text-kombee-text">admin@example.com / admin123</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Instructor:</span> 
              <span className="text-kombee-text">instructor@example.com / instructor123</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Student:</span> 
              <span className="text-kombee-text">student@example.com / student123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
