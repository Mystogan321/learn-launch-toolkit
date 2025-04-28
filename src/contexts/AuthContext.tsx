
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define user roles
export type UserRole = 'admin' | 'instructor' | 'student';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Mock users for demonstration
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin' as UserRole,
  },
  {
    id: '2',
    email: 'instructor@example.com',
    password: 'instructor123',
    name: 'Instructor User',
    role: 'instructor' as UserRole,
  },
  {
    id: '3',
    email: 'student@example.com',
    password: 'student123',
    name: 'Student User',
    role: 'student' as UserRole,
  },
];

// Auth context interface
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInstructor: boolean;
  isStudent: boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check for existing user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('kombeeUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('kombeeUser');
      }
    }
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      // Create user object (omitting password)
      const authUser: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      };

      // Save user to state and localStorage
      setUser(authUser);
      localStorage.setItem('kombeeUser', JSON.stringify(authUser));
      return true;
    }

    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('kombeeUser');
  };

  // Check if user has specific role(s)
  const hasRole = (role: UserRole | UserRole[]) => {
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  };

  // Context value
  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isInstructor: user?.role === 'instructor',
    isStudent: user?.role === 'student',
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
