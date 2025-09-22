import axios from 'axios';
import { API_CONFIG } from '../constants';
import { User, ApiResponse } from '../types';

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

// Mock authentication service - In real app, replace with actual API calls
export const login = async (credentials: {
  email: string;
  password: string;
}): Promise<{ user: User; token: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation
  if (credentials.email === 'demo@example.com' && credentials.password === 'password123') {
    const user: User = {
      id: '1',
      username: 'Demo User',
      email: credentials.email,
      profilePicture: 'https://via.placeholder.com/150',
      bio: 'Full-stack developer with 5+ years of experience',
      skills: ['React Native', 'TypeScript', 'Node.js', 'PostgreSQL'],
      experience: '5+ years',
      location: 'San Francisco, CA',
    };
    
    return {
      user,
      token: 'mock-jwt-token-' + Date.now(),
    };
  }
  
  throw new Error('Invalid credentials');
};

export const register = async (userData: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<{ user: User; token: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation
  if (userData.password !== userData.confirmPassword) {
    throw new Error('Passwords do not match');
  }
  
  if (userData.password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }
  
  const user: User = {
    id: Date.now().toString(),
    username: userData.username,
    email: userData.email,
    profilePicture: 'https://via.placeholder.com/150',
    bio: '',
    skills: [],
    experience: 'Entry level',
    location: '',
  };
  
  return {
    user,
    token: 'mock-jwt-token-' + Date.now(),
  };
};

export const updateProfile = async (profileData: Partial<User>): Promise<{ user: User }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock update - in real app, merge with existing user data from server
  const updatedUser: User = {
    id: profileData.id || '1',
    username: profileData.username || 'Demo User',
    email: profileData.email || 'demo@example.com',
    profilePicture: profileData.profilePicture || 'https://via.placeholder.com/150',
    bio: profileData.bio || '',
    skills: profileData.skills || [],
    experience: profileData.experience || 'Entry level',
    location: profileData.location || '',
    resume: profileData.resume,
  };
  
  return { user: updatedUser };
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    message: 'Password reset email sent to ' + email,
  };
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    message: 'Password changed successfully',
  };
};

// Axios interceptors for token management
api.interceptors.request.use((config) => {
  // Add token to requests if available
  const token = 'mock-token'; // Get from storage in real implementation
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle auth errors
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
    }
    return Promise.reject(error);
  }
);

export default api;