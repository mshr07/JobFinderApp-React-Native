import axios from 'axios';
import { API_CONFIG, MOCK_JOBS, JOB_CATEGORIES, JOB_TYPES, PAGINATION } from '../constants';
import { Job, ApiResponse, JobFilters } from '../types';

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

// Mock job data generator
const generateMockJob = (id: number, title?: string): Job => {
  const companies = ['TechCorp', 'InnovateLabs', 'DataDriven Co.', 'CloudFirst', 'MobileTech', 'StartupHub'];
  const locations = ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Boston, MA', 'Remote'];
  const types = JOB_TYPES;
  const categories = JOB_CATEGORIES;
  
  const randomTitle = title || [
    'Senior React Native Developer',
    'Frontend Engineer',
    'Full Stack Developer',
    'UX/UI Designer',
    'Product Manager',
    'Data Scientist',
    'DevOps Engineer',
    'Backend Developer',
    'Mobile App Developer',
    'Software Architect'
  ][id % 10];
  
  return {
    id: id.toString(),
    title: randomTitle,
    company: companies[id % companies.length],
    location: locations[id % locations.length],
    description: `We are looking for an experienced ${randomTitle.toLowerCase()} to join our team. This is a great opportunity to work with cutting-edge technologies and make a real impact.`,
    requirements: [
      'React Native',
      'TypeScript',
      'JavaScript',
      'Redux',
      'RESTful APIs',
    ].slice(0, 3 + (id % 3)),
    salary: {
      min: 80000 + (id % 5) * 20000,
      max: 120000 + (id % 5) * 30000,
      currency: 'USD'
    },
    type: types[id % types.length] as any,
    postedAt: new Date(Date.now() - (id % 30) * 24 * 60 * 60 * 1000).toISOString(),
    applicationUrl: `https://example.com/apply/${id}`,
    logo: `https://via.placeholder.com/100x100/0${id % 9}${id % 9}${id % 9}${id % 9}${id % 9}${id % 9}/FFFFFF?text=${companies[id % companies.length].charAt(0)}`,
    category: categories[id % categories.length],
  };
};

export const fetchJobs = async (
  page: number = 1,
  searchQuery: string = '',
  filters: JobFilters = {}
): Promise<ApiResponse<Job[]>> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const limit = PAGINATION.JOBS_PER_PAGE;
  const startIndex = (page - 1) * limit;
  
  // Generate more mock jobs
  let allJobs: Job[] = [];
  for (let i = 1; i <= 100; i++) {
    allJobs.push(generateMockJob(i));
  }
  
  // Add the predefined mock jobs
  allJobs = [...MOCK_JOBS, ...allJobs];
  
  // Apply search query filter
  if (searchQuery) {
    allJobs = allJobs.filter(job => 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Apply filters
  if (filters.location) {
    allJobs = allJobs.filter(job => 
      job.location.toLowerCase().includes(filters.location!.toLowerCase())
    );
  }
  
  if (filters.type) {
    allJobs = allJobs.filter(job => job.type === filters.type);
  }
  
  if (filters.category) {
    allJobs = allJobs.filter(job => job.category === filters.category);
  }
  
  if (filters.salaryRange) {
    allJobs = allJobs.filter(job => {
      if (!job.salary) return false;
      return job.salary.min >= filters.salaryRange!.min && 
             job.salary.max <= filters.salaryRange!.max;
    });
  }
  
  // Paginate results
  const paginatedJobs = allJobs.slice(startIndex, startIndex + limit);
  const hasMore = startIndex + limit < allJobs.length;
  
  return {
    data: paginatedJobs,
    message: 'Jobs fetched successfully',
    success: true,
    pagination: {
      page,
      limit,
      total: allJobs.length,
      hasMore,
    },
  };
};

export const searchJobs = async (
  query: string,
  filters: JobFilters = {}
): Promise<ApiResponse<Job[]>> => {
  return fetchJobs(1, query, filters);
};

export const fetchJobDetails = async (jobId: string): Promise<ApiResponse<Job>> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check if it's one of our predefined jobs
  const predefinedJob = MOCK_JOBS.find(job => job.id === jobId);
  if (predefinedJob) {
    return {
      data: predefinedJob,
      message: 'Job details fetched successfully',
      success: true,
    };
  }
  
  // Generate mock job for any other ID
  const job = generateMockJob(parseInt(jobId) || 1);
  job.id = jobId;
  
  return {
    data: job,
    message: 'Job details fetched successfully',
    success: true,
  };
};

export const fetchPopularJobs = async (): Promise<ApiResponse<Job[]>> => {
  const response = await fetchJobs(1, '', {});
  return {
    ...response,
    data: response.data.slice(0, 5), // Return first 5 as popular
  };
};

export const fetchJobsByCategory = async (category: string): Promise<ApiResponse<Job[]>> => {
  return fetchJobs(1, '', { category });
};

export const applyForJob = async (jobId: string, applicationData: {
  coverLetter?: string;
  resume?: string;
}): Promise<ApiResponse<{ applicationId: string }>> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    data: {
      applicationId: `app_${Date.now()}`,
    },
    message: 'Application submitted successfully',
    success: true,
  };
};

export const getApplicationStatus = async (applicationId: string): Promise<ApiResponse<{
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedAt: string;
}>> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const statuses = ['pending', 'reviewed', 'accepted', 'rejected'] as const;
  
  return {
    data: {
      status: statuses[Math.floor(Math.random() * statuses.length)],
      appliedAt: new Date().toISOString(),
    },
    message: 'Application status fetched successfully',
    success: true,
  };
};

// Real API call example (commented out - uncomment when you have a real API)
/*
export const fetchJobs = async (
  page: number = 1,
  searchQuery: string = '',
  filters: JobFilters = {}
): Promise<ApiResponse<Job[]>> => {
  try {
    const response = await api.get('/jobs', {
      params: {
        page,
        limit: PAGINATION.JOBS_PER_PAGE,
        search: searchQuery,
        ...filters,
      },
    });
    
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch jobs');
  }
};
*/

export default api;