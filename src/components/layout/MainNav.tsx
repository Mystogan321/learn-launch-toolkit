
import { Bell } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MainNavProps {
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
}

export function MainNav({ user = { name: "admin-demo", role: "admin" } }: MainNavProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  // Get initials from name for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="border-b border-border/40 bg-kombee-background sticky top-0 z-50">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
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
            <Link
              to="/admin"
              className="text-sm font-medium text-kombee-text hover:text-primary transition-colors"
            >
              Admin
            </Link>
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-4">
          {/* Notifications */}
          <button className="relative rounded-full p-1.5 text-kombee-text hover:bg-white/10">
            <Bell size={20} />
          </button>

          {/* User Menu */}
          <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
            <DropdownMenuTrigger asChild>
              <button 
                className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="User menu"
              >
                <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block text-sm font-medium text-white">
                  {user.name}
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
                  className="text-white hidden md:block"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/logout">Sign out</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
