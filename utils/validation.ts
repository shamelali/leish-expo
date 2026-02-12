import { z } from 'zod';

// Email validation
export const emailSchema = z.string().email('Invalid email address');

// Password validation
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[0-9]/, 'Password must contain a number');

// Name validation
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters');

// Login form schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Signup form schema
export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type SignupFormData = z.infer<typeof signupSchema>;

// Validation utilities
export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  try {
    emailSchema.parse(email);
    return { valid: true };
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return { valid: false, error: err.issues[0]?.message || 'Invalid email' };
    }
    return { valid: false, error: 'Invalid email' };
  }
};

export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  try {
    passwordSchema.parse(password);
    return { valid: true };
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return { valid: false, error: err.issues[0]?.message || 'Invalid password' };
    }
    return { valid: false, error: 'Invalid password' };
  }
};

export const validateName = (name: string): { valid: boolean; error?: string } => {
  try {
    nameSchema.parse(name);
    return { valid: true };
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return { valid: false, error: err.issues[0]?.message || 'Invalid name' };
    }
    return { valid: false, error: 'Invalid name' };
  }
};

// Form parsing
export const parseLoginForm = (data: any) => {
  try {
    return loginSchema.parse(data);
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      err.issues.forEach((error) => {
        const path = error.path[0];
        if (path) {
          errors[path.toString()] = error.message;
        }
      });
      throw errors;
    }
    throw { general: 'Validation failed' };
  }
};

export const parseSignupForm = (data: any) => {
  try {
    return signupSchema.parse(data);
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      err.issues.forEach((error) => {
        const path = error.path[0];
        if (path) {
          errors[path.toString()] = error.message;
        }
      });
      throw errors;
    }
    throw { general: 'Validation failed' };
  }
};
