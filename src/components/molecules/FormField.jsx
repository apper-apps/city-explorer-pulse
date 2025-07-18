import React from "react";
import { cn } from "@/utils/cn";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";

const FormField = React.forwardRef(({ 
  className, 
  label, 
  error, 
  required = false, 
  helperText,
  ...props 
}, ref) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label required={required}>
          {label}
        </Label>
      )}
      <Input
        ref={ref}
        error={error}
        {...props}
      />
      {error && (
        <p className="text-sm text-error font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-secondary-600">{helperText}</p>
      )}
    </div>
  );
});

FormField.displayName = "FormField";

export default FormField;