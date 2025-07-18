import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "md", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-secondary-100 text-secondary-800 border border-secondary-200",
    primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 border border-primary-300",
    accent: "bg-gradient-to-r from-accent-100 to-accent-200 text-accent-800 border border-accent-300",
    success: "bg-green-100 text-green-800 border border-green-300",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    error: "bg-red-100 text-red-800 border border-red-300",
    info: "bg-blue-100 text-blue-800 border border-blue-300",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs font-medium",
    md: "px-2.5 py-1 text-sm font-medium",
    lg: "px-3 py-1.5 text-base font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium transition-all duration-200",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;