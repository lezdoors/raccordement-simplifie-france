import { useState, useCallback } from "react";

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

interface ValidationSchema {
  [key: string]: ValidationRule;
}

interface UseFormValidationReturn {
  errors: Record<string, string>;
  validate: (field: string, value: any) => string | null;
  validateAll: (data: Record<string, any>) => boolean;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
}

export const useFormValidation = (schema: ValidationSchema): UseFormValidationReturn => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback((field: string, value: any): string | null => {
    const rule = schema[field];
    if (!rule) return null;

    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return "Ce champ est requis";
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }

    // Min length validation
    if (rule.minLength && value.length < rule.minLength) {
      return `Minimum ${rule.minLength} caractères requis`;
    }

    // Max length validation
    if (rule.maxLength && value.length > rule.maxLength) {
      return `Maximum ${rule.maxLength} caractères autorisés`;
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      if (field === 'email') return "Format d'email invalide";
      if (field === 'phone') return "Format de téléphone invalide";
      return "Format invalide";
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }, [schema]);

  const validateAll = useCallback((data: Record<string, any>): boolean => {
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    Object.keys(schema).forEach(field => {
      const error = validate(field, data[field]);
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  }, [schema, validate]);

  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validate,
    validateAll,
    clearError,
    clearAllErrors
  };
};

// Common validation schemas
export const emailValidation: ValidationRule = {
  required: true,
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

export const phoneValidation: ValidationRule = {
  required: true,
  pattern: /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/
};

export const nameValidation: ValidationRule = {
  required: true,
  minLength: 2,
  maxLength: 50
};