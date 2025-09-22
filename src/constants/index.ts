// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://dummyjson.com',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// Mock API for jobs (using DummyJSON structure)
export const JOBS_API = {
  SEARCH: '/posts', // We'll mock this as job listings
  POPULAR: '/posts?limit=20',
  CATEGORIES: '/posts/search?q=',
};

// Job Categories
export const JOB_CATEGORIES = [
  'Technology',
  'Marketing',
  'Design',
  'Sales',
  'Customer Service',
  'Human Resources',
  'Finance',
  'Operations',
  'Engineering',
  'Healthcare',
];

// Job Types
export const JOB_TYPES = [
  'full-time',
  'part-time',
  'contract',
  'remote',
];

// Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_DATA: 'user_data',
  SAVED_JOBS: 'saved_jobs',
  RECENTLY_VIEWED: 'recently_viewed',
  SEARCH_HISTORY: 'search_history',
  APP_SETTINGS: 'app_settings',
};

// Navigation Routes
export const ROUTES = {
  // Auth Stack
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
  
  // Main App
  HOME_TABS: 'HomeTabs',
  JOB_LIST: 'JobList',
  JOB_DETAILS: 'JobDetails',
  JOB_APPLICATION: 'JobApplication',
  PROFILE: 'Profile',
  SAVED_JOBS: 'SavedJobs',
  SEARCH: 'Search',
  SETTINGS: 'Settings',
  EDIT_PROFILE: 'EditProfile',
};

// Colors
export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  
  // Grays
  gray1: '#8E8E93',
  gray2: '#AEAEB2',
  gray3: '#C7C7CC',
  gray4: '#D1D1D6',
  gray5: '#E5E5EA',
  gray6: '#F2F2F7',
  
  // System
  background: '#FFFFFF',
  systemBackground: '#F2F2F7',
  label: '#000000',
  secondaryLabel: '#3C3C43',
  tertiaryLabel: '#3C3C4399',
  
  // Card colors
  cardBackground: '#FFFFFF',
  cardBorder: '#E5E5EA',
  
  // Status colors
  applied: '#007AFF',
  saved: '#FF9500',
  viewed: '#8E8E93',
};

// Fonts
export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  semiBold: 'System',
};

// Sizes
export const SIZES = {
  // Padding
  padding: 16,
  paddingHorizontal: 20,
  paddingVertical: 16,
  
  // Margins
  margin: 16,
  marginHorizontal: 20,
  marginVertical: 16,
  
  // Borders
  borderRadius: 12,
  borderWidth: 1,
  
  // Icons
  iconSmall: 16,
  iconMedium: 24,
  iconLarge: 32,
  
  // Buttons
  buttonHeight: 48,
  
  // Input
  inputHeight: 48,
};

// Animation durations
export const ANIMATION_DURATION = {
  short: 150,
  medium: 300,
  long: 500,
};

// Validation patterns
export const VALIDATION = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s-()]{10,}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
};

// Pagination
export const PAGINATION = {
  JOBS_PER_PAGE: 10,
  MAX_PAGES: 50,
};

// Notification types
export const NOTIFICATION_TYPES = {
  JOB_ALERT: 'job_alert',
  APPLICATION_UPDATE: 'application_update',
  NEW_MATCH: 'new_match',
  PROFILE_VIEW: 'profile_view',
};

// Mock job data for development
export const MOCK_JOBS = [
  {
    id: '1',
    title: 'Senior React Native Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    description: 'We are looking for an experienced React Native developer to join our mobile team.',
    requirements: ['React Native', 'TypeScript', 'Redux', 'Jest'],
    salary: { min: 120000, max: 150000, currency: 'USD' },
    type: 'full-time' as const,
    postedAt: '2024-01-15T10:00:00Z',
    applicationUrl: 'https://example.com/apply/1',
    category: 'Technology',
    logo: 'https://via.placeholder.com/100x100/007AFF/FFFFFF?text=T',
  },
  {
    id: '2',
    title: 'UX/UI Designer',
    company: 'Design Studio',
    location: 'New York, NY',
    description: 'Join our creative team as a UX/UI Designer working on mobile and web applications.',
    requirements: ['Figma', 'Sketch', 'User Research', 'Prototyping'],
    salary: { min: 80000, max: 100000, currency: 'USD' },
    type: 'full-time' as const,
    postedAt: '2024-01-14T14:30:00Z',
    applicationUrl: 'https://example.com/apply/2',
    category: 'Design',
    logo: 'https://via.placeholder.com/100x100/5856D6/FFFFFF?text=D',
  },
];
