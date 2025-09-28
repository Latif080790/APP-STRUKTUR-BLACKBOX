/**
 * Enhanced form hook with Zod validation, real-time feedback, and error handling
 * Provides comprehensive form state management with TypeScript support
 */

import { useCallback, useMemo, useState, useEffect } from 'react';
import { useForm, UseFormProps, UseFormReturn, FieldError, FieldValues, Path, PathValue } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Error types for better type safety
export interface FormFieldError {
  field: string;
  message: string;
  type: string;
}

export interface FormValidationResult<T> {
  isValid: boolean;
  errors: FormFieldError[];
  warnings: string[];
  data?: T;
}

// Enhanced form options
export interface EnhancedFormOptions<TSchema extends z.ZodType, TFieldValues extends FieldValues> 
  extends Omit<UseFormProps<TFieldValues>, 'resolver'> {
  schema: TSchema;
  realTimeValidation?: boolean;
  debounceMs?: number;
  onValidationChange?: (result: FormValidationResult<z.infer<TSchema>>) => void;
  sanitizeOnChange?: boolean;
  logValidationErrors?: boolean;
}

// Enhanced form return type
export interface EnhancedFormReturn<TSchema extends z.ZodType, TFieldValues extends FieldValues> 
  extends UseFormReturn<TFieldValues> {
  // Validation state
  isValid: boolean;
  hasErrors: boolean;
  hasWarnings: boolean;
  validationErrors: FormFieldError[];
  validationWarnings: string[];
  
  // Enhanced methods
  validateField: (fieldName: keyof TFieldValues) => Promise<boolean>;
  validateAll: () => Promise<FormValidationResult<z.infer<TSchema>>>;
  clearFieldError: (fieldName: keyof TFieldValues) => void;
  clearAllErrors: () => void;
  resetToDefaults: () => void;
  
  // Data transformation
  getCleanData: () => z.infer<TSchema> | null;
  getSanitizedValue: (fieldName: keyof TFieldValues) => any;
  
  // Utility methods
  isFieldTouched: (fieldName: keyof TFieldValues) => boolean;
  isFieldValid: (fieldName: keyof TFieldValues) => boolean;
  getFieldError: (fieldName: keyof TFieldValues) => string | undefined;
}

// Custom sanitization functions
const sanitizeNumber = (value: any): number | undefined => {
  if (value === '' || value === null || value === undefined) return undefined;
  const num = parseFloat(value);
  return isNaN(num) ? undefined : num;
};

const sanitizeString = (value: any): string => {
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

const sanitizeBoolean = (value: any): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return Boolean(value);
};

// Sanitization helper
const sanitizeValue = (value: any, fieldType: string): any => {
  switch (fieldType) {
    case 'number':
      return sanitizeNumber(value);
    case 'string':
      return sanitizeString(value);
    case 'boolean':
      return sanitizeBoolean(value);
    default:
      return value;
  }
};

// Debounce utility
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Enhanced form hook with comprehensive validation and error handling
 */
export function useEnhancedForm<TSchema extends z.ZodType, TFieldValues extends FieldValues = z.infer<TSchema>>({
  schema,
  realTimeValidation = true,
  debounceMs = 300,
  onValidationChange,
  sanitizeOnChange = true,
  logValidationErrors = process.env.NODE_ENV === 'development',
  ...formOptions
}: EnhancedFormOptions<TSchema, TFieldValues>): EnhancedFormReturn<TSchema, TFieldValues> {
  
  // Form setup with Zod resolver
  const form = useForm<TFieldValues>({
    ...formOptions,
    resolver: zodResolver(schema),
    mode: realTimeValidation ? 'onChange' : 'onSubmit',
    reValidateMode: realTimeValidation ? 'onChange' : 'onSubmit',
  });

  // Additional state
  const [validationErrors, setValidationErrors] = useState<FormFieldError[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Watch form values for real-time validation
  const watchedValues = form.watch();
  const debouncedValues = useDebounce(watchedValues, debounceMs);

  // Extract field information from schema for better sanitization
  const fieldTypes = useMemo(() => {
    const types: Record<string, string> = {};
    
    try {
      if (schema instanceof z.ZodObject) {
        const shape = schema.shape;
        Object.keys(shape).forEach(key => {
          const field = shape[key];
          if (field instanceof z.ZodNumber) types[key] = 'number';
          else if (field instanceof z.ZodString) types[key] = 'string';
          else if (field instanceof z.ZodBoolean) types[key] = 'boolean';
          else if (field instanceof z.ZodOptional) {
            const inner = field._def.innerType;
            if (inner instanceof z.ZodNumber) types[key] = 'number';
            else if (inner instanceof z.ZodString) types[key] = 'string';
            else if (inner instanceof z.ZodBoolean) types[key] = 'boolean';
          }
        });
      }
    } catch (error) {
      if (logValidationErrors) {
        console.warn('Failed to extract field types from schema:', error);
      }
    }
    
    return types;
  }, [schema, logValidationErrors]);

  // Validate field individually
  const validateField = useCallback(async (fieldName: keyof TFieldValues): Promise<boolean> => {
    try {
      const currentValue = form.getValues(fieldName as Path<TFieldValues>);
      const fieldSchema = schema.pick({ [fieldName]: true } as any);
      
      const result = await fieldSchema.safeParseAsync({ [fieldName]: currentValue });
      
      if (!result.success) {
        const fieldErrors = result.error.errors
          .filter(err => err.path.includes(fieldName as string))
          .map(err => ({
            field: fieldName as string,
            message: err.message,
            type: err.code
          }));
        
        setValidationErrors(prev => {
          const filtered = prev.filter(e => e.field !== fieldName);
          return [...filtered, ...fieldErrors];
        });
        
        return false;
      } else {
        setValidationErrors(prev => prev.filter(e => e.field !== fieldName));
        return true;
      }
    } catch (error) {
      if (logValidationErrors) {
        console.error(`Field validation error for ${String(fieldName)}:`, error);
      }
      return false;
    }
  }, [form, schema, logValidationErrors]);

  // Validate all fields
  const validateAll = useCallback(async (): Promise<FormValidationResult<z.infer<TSchema>>> => {
    try {
      const currentValues = form.getValues();
      const result = await schema.safeParseAsync(currentValues);
      
      if (result.success) {
        const validationResult = {
          isValid: true,
          errors: [],
          warnings: [],
          data: result.data
        };
        
        setValidationErrors([]);
        setValidationWarnings([]);
        
        if (onValidationChange) {
          onValidationChange(validationResult);
        }
        
        return validationResult;
      } else {
        const errors = result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          type: err.code
        }));
        
        const validationResult = {
          isValid: false,
          errors,
          warnings: [],
          data: undefined
        };
        
        setValidationErrors(errors);
        
        if (logValidationErrors) {
          console.warn('Form validation errors:', errors);
        }
        
        if (onValidationChange) {
          onValidationChange(validationResult);
        }
        
        return validationResult;
      }
    } catch (error) {
      const errorResult = {
        isValid: false,
        errors: [{
          field: 'general',
          message: error instanceof Error ? error.message : 'Unknown validation error',
          type: 'custom'
        }],
        warnings: [],
        data: undefined
      };
      
      if (logValidationErrors) {
        console.error('Form validation exception:', error);
      }
      
      return errorResult;
    }
  }, [form, schema, onValidationChange, logValidationErrors]);

  // Real-time validation effect
  useEffect(() => {
    if (realTimeValidation && Object.keys(debouncedValues).length > 0) {
      validateAll();
    }
  }, [debouncedValues, realTimeValidation, validateAll]);

  // Clear specific field error
  const clearFieldError = useCallback((fieldName: keyof TFieldValues) => {
    form.clearErrors(fieldName as Path<TFieldValues>);
    setValidationErrors(prev => prev.filter(e => e.field !== fieldName));
  }, [form]);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    form.clearErrors();
    setValidationErrors([]);
    setValidationWarnings([]);
  }, [form]);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    form.reset();
    clearAllErrors();
    setTouchedFields(new Set());
  }, [form, clearAllErrors]);

  // Get clean, validated data
  const getCleanData = useCallback((): z.infer<TSchema> | null => {
    try {
      const currentValues = form.getValues();
      const result = schema.safeParse(currentValues);
      return result.success ? result.data : null;
    } catch (error) {
      if (logValidationErrors) {
        console.error('Failed to get clean data:', error);
      }
      return null;
    }
  }, [form, schema, logValidationErrors]);

  // Get sanitized value for a specific field
  const getSanitizedValue = useCallback((fieldName: keyof TFieldValues): any => {
    const currentValue = form.getValues(fieldName as Path<TFieldValues>);
    const fieldType = fieldTypes[String(fieldName)] || 'string';
    return sanitizeValue(currentValue, fieldType);
  }, [form, fieldTypes]);

  // Enhanced setValue with sanitization
  const enhancedSetValue = useCallback((
    name: Path<TFieldValues>,
    value: PathValue<TFieldValues, Path<TFieldValues>>,
    options?: { shouldValidate?: boolean; shouldDirty?: boolean; shouldTouch?: boolean; }
  ) => {
    let sanitizedValue = value;
    
    if (sanitizeOnChange) {
      const fieldType = fieldTypes[String(name)] || 'string';
      sanitizedValue = sanitizeValue(value, fieldType) as PathValue<TFieldValues, Path<TFieldValues>>;
    }
    
    // Track touched fields
    setTouchedFields(prev => new Set(prev).add(String(name)));
    
    form.setValue(name, sanitizedValue, {
      shouldValidate: realTimeValidation,
      ...options
    });
  }, [form, sanitizeOnChange, fieldTypes, realTimeValidation]);

  // Utility methods
  const isFieldTouched = useCallback((fieldName: keyof TFieldValues): boolean => {
    return touchedFields.has(String(fieldName));
  }, [touchedFields]);

  const isFieldValid = useCallback((fieldName: keyof TFieldValues): boolean => {
    const formError = form.formState.errors[fieldName as Path<TFieldValues>];
    const validationError = validationErrors.some(e => e.field === String(fieldName));
    return !formError && !validationError;
  }, [form.formState.errors, validationErrors]);

  const getFieldError = useCallback((fieldName: keyof TFieldValues): string | undefined => {
    const formError = form.formState.errors[fieldName as Path<TFieldValues>] as FieldError | undefined;
    if (formError) return formError.message;
    
    const validationError = validationErrors.find(e => e.field === String(fieldName));
    return validationError?.message;
  }, [form.formState.errors, validationErrors]);

  // Computed states
  const isValid = useMemo(() => 
    form.formState.isValid && validationErrors.length === 0,
    [form.formState.isValid, validationErrors.length]
  );

  const hasErrors = useMemo(() => 
    Object.keys(form.formState.errors).length > 0 || validationErrors.length > 0,
    [form.formState.errors, validationErrors.length]
  );

  const hasWarnings = useMemo(() => 
    validationWarnings.length > 0,
    [validationWarnings.length]
  );

  return {
    ...form,
    setValue: enhancedSetValue,
    
    // Validation state
    isValid,
    hasErrors,
    hasWarnings,
    validationErrors,
    validationWarnings,
    
    // Enhanced methods
    validateField,
    validateAll,
    clearFieldError,
    clearAllErrors,
    resetToDefaults,
    
    // Data transformation
    getCleanData,
    getSanitizedValue,
    
    // Utility methods
    isFieldTouched,
    isFieldValid,
    getFieldError,
  };
}

// Helper hook for field-specific validation feedback
export function useFieldValidation<T extends FieldValues>(
  form: EnhancedFormReturn<any, T>,
  fieldName: keyof T
) {
  return useMemo(() => ({
    hasError: !form.isFieldValid(fieldName),
    errorMessage: form.getFieldError(fieldName),
    isTouched: form.isFieldTouched(fieldName),
    isValid: form.isFieldValid(fieldName),
    
    // Validation feedback helpers
    getValidationClass: (baseClass = '') => {
      if (!form.isFieldTouched(fieldName)) return baseClass;
      if (form.isFieldValid(fieldName)) return `${baseClass} valid`;
      return `${baseClass} invalid`;
    },
    
    getValidationProps: () => ({
      'aria-invalid': !form.isFieldValid(fieldName),
      'aria-describedby': form.getFieldError(fieldName) ? `${String(fieldName)}-error` : undefined,
    })
  }), [form, fieldName]);
}

export default useEnhancedForm;