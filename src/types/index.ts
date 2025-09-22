export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  postedAt: string;
  applicationUrl: string;
  logo?: string;
  category: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  skills: string[];
  experience: string;
  location?: string;
  resume?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface JobsState {
  jobs: Job[];
  savedJobs: Job[];
  recentlyViewed: Job[];
  isLoading: boolean;
  searchQuery: string;
  filters: JobFilters;
  hasMore: boolean;
  page: number;
}

export interface JobFilters {
  location?: string;
  type?: string;
  category?: string;
  salaryRange?: {
    min: number;
    max: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  appliedAt: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  coverLetter?: string;
}

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
}