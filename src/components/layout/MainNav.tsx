
import { Bell, LogOut, User, Settings } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function MainNav() {
  const { user, logout, isAdmin } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get initials from name for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  return (
    <header className="border-b border-border/40 bg-kombee-background sticky top-0 z-50">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <span className="text-white font-bold">K</span>
            </div>
            <span className="text-2xl font-bold text-kombee-text">Kombee</span>
          </Link>

          {/* Main Navigation */}
          <nav className="hidden md:flex gap-6 items-center">
            <Link
              to="/dashboard"
              className="text-sm font-medium text-kombee-text hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/courses"
              className="text-sm font-medium text-kombee-text hover:text-primary transition-colors"
            >
              Courses
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="text-sm font-medium text-kombee-text hover:text-primary transition-colors"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-4">
          {/* Role Badge */}
          {user && (
            <span className="hidden md:inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
              {user.role}
            </span>
          )}

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="text-kombee-text hover:bg-white/10">
            <Bell size={20} />
          </Button>

          {/* User Menu */}
          <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary p-1"
                aria-label="User menu"
              >
                <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                  <AvatarFallback>{user ? getInitials(user.name) : "U"}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block text-sm font-medium text-kombee-text">
                  {user?.name || "User"}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-kombee-text hidden md:block"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center">
                  <User size={16} className="mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center">
                  <Settings size={16} className="mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="flex items-center text-destructive">
                <LogOut size={16} className="mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
