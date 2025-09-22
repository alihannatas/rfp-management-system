// Validation utility functions
export const validateEmail = (email: string): string | null => {
  if (!email) return 'E-posta adresi gerekli';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Geçerli bir e-posta adresi girin';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Şifre gerekli';
  if (password.length < 6) return 'Şifre en az 6 karakter olmalı';
  return null;
};

export const validateRequired = (value: any, fieldName: string): string | null => {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} gerekli`;
  }
  return null;
};

export const validateMinLength = (value: string, minLength: number, fieldName: string): string | null => {
  if (value && value.length < minLength) {
    return `${fieldName} en az ${minLength} karakter olmalı`;
  }
  return null;
};

export const validateMaxLength = (value: string, maxLength: number, fieldName: string): string | null => {
  if (value && value.length > maxLength) {
    return `${fieldName} en fazla ${maxLength} karakter olmalı`;
  }
  return null;
};

export const validateNumber = (value: any, fieldName: string): string | null => {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  if (isNaN(num)) return `${fieldName} geçerli bir sayı olmalı`;
  return null;
};

export const validatePositiveNumber = (value: any, fieldName: string): string | null => {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  if (isNaN(num)) return `${fieldName} geçerli bir sayı olmalı`;
  if (num < 0) return `${fieldName} pozitif bir sayı olmalı`;
  return null;
};

export const validateDate = (value: string, fieldName: string): string | null => {
  if (!value) return null;
  const date = new Date(value);
  if (isNaN(date.getTime())) return `${fieldName} geçerli bir tarih olmalı`;
  return null;
};

export const validateDateRange = (startDate: string, endDate: string): string | null => {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (start >= end) return 'Bitiş tarihi başlangıç tarihinden sonra olmalı';
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone) return null;
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
  if (!phoneRegex.test(phone)) return 'Geçerli bir telefon numarası girin';
  return null;
};

export const validateForm = (data: Record<string, any>, rules: Record<string, any[]>): Record<string, string> => {
  const errors: Record<string, string> = {};

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field];
    
    for (const rule of fieldRules) {
      if (typeof rule === 'function') {
        const error = rule(value);
        if (error) {
          errors[field] = error;
          break;
        }
      } else if (typeof rule === 'object' && rule.validator) {
        const error = rule.validator(value, rule.fieldName || field);
        if (error) {
          errors[field] = error;
          break;
        }
      }
    }
  }

  return errors;
};
