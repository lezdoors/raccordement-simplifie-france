import * as React from "react";
import { cn } from "@/lib/utils";

export interface MobileOptimizedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  touched?: boolean;
}

const MobileOptimizedInput = React.forwardRef<HTMLInputElement, MobileOptimizedInputProps>(
  ({ className, type, error, label, touched, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-lg border border-input bg-background px-4 py-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            // Mobile-specific optimizations
            "touch-manipulation",
            "text-base", // Prevents zoom on iOS
            error && touched && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && touched && (
          <p className="text-sm text-destructive mt-1 animate-in slide-in-from-left-2">
            {error}
          </p>
        )}
      </div>
    );
  }
);
MobileOptimizedInput.displayName = "MobileOptimizedInput";

export { MobileOptimizedInput };