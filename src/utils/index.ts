import { VALIDATION } from '../constants';

// Validation utilities
export const validateEmail = (email: string): boolean => {
  return VALIDATION.EMAIL.test(email);
};

export const validatePassword = (password: string): boolean => {
  return VALIDATION.PASSWORD.test(password);
};

export const validatePhone = (phone: string): boolean => {
  return VALIDATION.PHONE.test(phone);
};

// Date utilities
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInHours < 24 * 7) {
    return `${Math.floor(diffInHours / 24)}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export const formatSalary = (min: number, max: number, currency: string = 'USD'): string => {
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}k`;
    }
    return num.toString();
  };
  
  if (currency === 'USD') {
    return `$${formatNumber(min)} - $${formatNumber(max)}`;
  }
  
  return `${currency} ${formatNumber(min)} - ${formatNumber(max)}`;
};

// String utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const generateInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Array utilities
export const removeDuplicates = <T>(array: T[], key: keyof T): T[] => {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

export const sortByDate = <T extends { postedAt: string }>(array: T[], ascending: boolean = false): T[] => {
  return [...array].sort((a, b) => {
    const dateA = new Date(a.postedAt).getTime();
    const dateB = new Date(b.postedAt).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

// Error handling utilities
export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.response?.data?.message) return error.response.data.message;
  return 'An unexpected error occurred';
};

// Storage utilities
export const safeJSONParse = <T>(jsonString: string | null, defaultValue: T): T => {
  try {
    return jsonString ? JSON.parse(jsonString) : defaultValue;
  } catch {
    return defaultValue;
  }
};

// Device utilities
export const isTablet = (width: number, height: number): boolean => {
  const smallerDimension = Math.min(width, height);
  return smallerDimension >= 600;
};

// Color utilities
export const hexToRgba = (hex: string, alpha: number = 1): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Distance calculation (for location-based features)
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Job matching utility (for recommendation features)
export const calculateJobMatch = (userSkills: string[], jobRequirements: string[]): number => {
  if (jobRequirements.length === 0) return 0;
  
  const matches = jobRequirements.filter(requirement =>
    userSkills.some(skill => 
      skill.toLowerCase().includes(requirement.toLowerCase()) ||
      requirement.toLowerCase().includes(skill.toLowerCase())
    )
  );
  
  return Math.round((matches.length / jobRequirements.length) * 100);
};

// URL utilities
export const isValidUrl = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Platform utilities
export const isIOS = (): boolean => {
  return require('react-native').Platform.OS === 'ios';
};

export const isAndroid = (): boolean => {
  return require('react-native').Platform.OS === 'android';
};

// Accessibility utilities
export const generateAccessibilityLabel = (text: string): string => {
  return text.replace(/[^\w\s]/gi, '').trim();
};

export default {
  validateEmail,
  validatePassword,
  validatePhone,
  formatDate,
  formatSalary,
  truncateText,
  capitalizeFirstLetter,
  generateInitials,
  removeDuplicates,
  sortByDate,
  getErrorMessage,
  safeJSONParse,
  isTablet,
  hexToRgba,
  debounce,
  throttle,
  calculateDistance,
  calculateJobMatch,
  isValidUrl,
  isIOS,
  isAndroid,
  generateAccessibilityLabel,
};