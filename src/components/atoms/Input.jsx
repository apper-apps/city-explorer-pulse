import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  className, 
  type = "text", 
  variant = "default", 
  size = "md", 
  error,
  ...props 
}, ref) => {
  const variants = {
    default: "border-secondary-300 bg-surface focus:border-primary-500 focus:ring-primary-500",
    outline: "border-2 border-secondary-300 bg-surface focus:border-primary-500 focus:ring-primary-500",
    filled: "border-secondary-200 bg-secondary-50 focus:border-primary-500 focus:ring-primary-500 focus:bg-surface",
    ghost: "border-transparent bg-secondary-100 focus:border-primary-500 focus:ring-primary-500 focus:bg-surface",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-4 py-3 text-base",
  };

  return (
    <input
      type={type}
      className={cn(
        "flex w-full rounded-lg border font-medium placeholder:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
        variants[variant],
        sizes[size],
        error && "border-error focus:border-error focus:ring-error",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;