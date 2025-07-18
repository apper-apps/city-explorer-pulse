import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  className, 
  variant = "default", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-surface border border-secondary-100 shadow-md hover:shadow-lg",
    elevated: "bg-surface shadow-lg hover:shadow-xl",
    gradient: "bg-gradient-to-br from-surface to-secondary-50 shadow-lg hover:shadow-xl",
    glass: "bg-surface/80 backdrop-blur-sm border border-secondary-100 shadow-lg hover:shadow-xl",
  };

  return (
    <div
      className={cn(
        "rounded-xl transition-all duration-200",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;