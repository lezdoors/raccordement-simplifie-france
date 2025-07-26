import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, AlertCircle } from "lucide-react";

export interface EnhancedMobileInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  touched?: boolean;
  success?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const EnhancedMobileInput = React.forwardRef<HTMLInputElement, EnhancedMobileInputProps>(
  ({ className, type, error, label, touched, success, helperText, leftIcon, rightIcon, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false);
    const hasValue = props.value || props.defaultValue;

    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-sm font-medium text-foreground">
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          
          <input
            type={type}
            className={cn(
              // Base styles
              "flex h-14 w-full rounded-xl border-2 bg-background px-4 py-3 text-base ring-offset-background",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              
              // Mobile optimizations
              "touch-manipulation transition-all duration-200",
              "text-base", // Prevents zoom on iOS
              
              // Padding adjustments for icons
              leftIcon && "pl-12",
              rightIcon && "pr-12",
              
              // State-based styling
              focused && "border-primary shadow-lg",
              error && touched && "border-destructive focus-visible:ring-destructive",
              success && "border-green-500 focus-visible:ring-green-500",
              
              // Default border
              !focused && !error && !success && "border-border hover:border-primary/50",
              
              className
            )}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            ref={ref}
            {...props}
          />
          
          {/* Right side icons */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {success && (
              <Check className="h-5 w-5 text-green-500" />
            )}
            {error && touched && (
              <AlertCircle className="h-5 w-5 text-destructive" />
            )}
            {rightIcon && (
              <div className="text-muted-foreground">
                {rightIcon}
              </div>
            )}
          </div>
        </div>
        
        {/* Helper text or error message */}
        {(helperText || (error && touched)) && (
          <div className="flex items-start space-x-2">
            {error && touched ? (
              <>
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-sm text-destructive animate-in slide-in-from-left-2">
                  {error}
                </p>
              </>
            ) : helperText ? (
              <p className="text-sm text-muted-foreground">
                {helperText}
              </p>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

EnhancedMobileInput.displayName = "EnhancedMobileInput";

export { EnhancedMobileInput };