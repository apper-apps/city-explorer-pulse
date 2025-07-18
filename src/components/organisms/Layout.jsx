import React from "react";
import { cn } from "@/utils/cn";
import Sidebar from "@/components/organisms/Sidebar";
import StatsHeader from "@/components/organisms/StatsHeader";

const Layout = ({ children, className, ...props }) => {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Stats Header */}
        <div className="p-6 border-b border-secondary-200 bg-surface">
          <StatsHeader />
        </div>
        
        {/* Main Content */}
        <main className={cn("flex-1 p-6", className)} {...props}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;