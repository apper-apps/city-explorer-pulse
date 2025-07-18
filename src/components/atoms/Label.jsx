import React from "react";
import { cn } from "@/utils/cn";

const Label = React.forwardRef(({ 
  className, 
  required = false, 
  children, 
  ...props 
}, ref) => {
  return (
    <label
      className={cn(
        "block text-sm font-semibold text-secondary-900 mb-2",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
      {required && <span className="text-error ml-1">*</span>}
    </label>
  );
});

Label.displayName = "Label";

export default Label;