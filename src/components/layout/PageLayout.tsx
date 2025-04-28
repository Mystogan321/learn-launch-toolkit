
import React from "react";
import { MainNav } from "./MainNav";

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageLayout({ children, title, subtitle, action }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-kombee-background">
      {/* Main Navigation */}
      <MainNav />
      
      {/* Page Content */}
      <main className="flex-1 p-6 md:p-10">
        {(title || action) && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              {title && <h1 className="text-2xl md:text-3xl font-bold text-kombee-text">{title}</h1>}
              {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
            </div>
            {action && <div className="mt-4 sm:mt-0">{action}</div>}
          </div>
        )}
        
        {children}
      </main>
    </div>
  );
}
