import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JobsState, Job, JobFilters } from '../../types';
import { STORAGE_KEYS, PAGINATION } from '../../constants';
import * as jobsService from '../../services/jobsService';

// Async thunks
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async ({ page = 1, searchQuery = '', filters = {} }: {
    page?: number;
    searchQuery?: string;
    filters?: JobFilters;
  }) => {
    const response = await jobsService.fetchJobs(page, searchQuery, filters);
    return { jobs: response.data, page, hasMore: response.pagination?.hasMore || false };
  }
);

export const searchJobs = createAsyncThunk(
  'jobs/searchJobs',
  async ({ query, filters = {} }: { query: string; filters?: JobFilters }) => {
    const response = await jobsService.searchJobs(query, filters);
    return { jobs: response.data, query };
  }
);

export const fetchJobDetails = createAsyncThunk(
  'jobs/fetchJobDetails',
  async (jobId: string) => {
    const response = await jobsService.fetchJobDetails(jobId);
    return response.data;
  }
);

export const loadSavedJobs = createAsyncThunk('jobs/loadSavedJobs', async () => {
  try {
    const savedJobsData = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
    return savedJobsData ? JSON.parse(savedJobsData) : [];
  } catch (error) {
    return [];
  }
});

export const loadRecentlyViewed = createAsyncThunk('jobs/loadRecentlyViewed', async () => {
  try {
    const recentData = await AsyncStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED);
    return recentData ? JSON.parse(recentData) : [];
  } catch (error) {
    return [];
  }
});

export const saveJob = createAsyncThunk('jobs/saveJob', async (job: Job) => {
  try {
    const savedJobsData = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
    const savedJobs = savedJobsData ? JSON.parse(savedJobsData) : [];
    
    const isAlreadySaved = savedJobs.find((savedJob: Job) => savedJob.id === job.id);
    if (!isAlreadySaved) {
      savedJobs.push(job);
      await AsyncStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(savedJobs));
    }
    
    return savedJobs;
  } catch (error) {
    throw error;
  }
});

export const unsaveJob = createAsyncThunk('jobs/unsaveJob', async (jobId: string) => {
  try {
    const savedJobsData = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
    const savedJobs = savedJobsData ? JSON.parse(savedJobsData) : [];
    
    const filteredJobs = savedJobs.filter((job: Job) => job.id !== jobId);
    await AsyncStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(filteredJobs));
    
    return filteredJobs;
  } catch (error) {
    throw error;
  }
});

export const addToRecentlyViewed = createAsyncThunk(
  'jobs/addToRecentlyViewed',
  async (job: Job) => {
    try {
      const recentData = await AsyncStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED);
      let recentJobs = recentData ? JSON.parse(recentData) : [];
      
      // Remove if already exists
      recentJobs = recentJobs.filter((recentJob: Job) => recentJob.id !== job.id);
      
      // Add to beginning
      recentJobs.unshift(job);
      
      // Keep only last 20 items
      recentJobs = recentJobs.slice(0, 20);
      
      await AsyncStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(recentJobs));
      return recentJobs;
    } catch (error) {
      throw error;
    }
  }
);

const initialState: JobsState = {
  jobs: [],
  savedJobs: [],
  recentlyViewed: [],
  isLoading: false,
  searchQuery: '',
  filters: {},
  hasMore: true,
  page: 1,
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action: PayloadAction<JobFilters>) => {
      state.filters = action.payload;
    },
    clearJobs: (state) => {
      state.jobs = [];
      state.page = 1;
      state.hasMore = true;
    },
    resetJobsState: (state) => {
      state.jobs = [];
      state.isLoading = false;
      state.searchQuery = '';
      state.filters = {};
      state.hasMore = true;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch jobs cases
      .addCase(fetchJobs.pending, (state, action) => {
        if (action.meta.arg.page === 1) {
          state.isLoading = true;
        }
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.page === 1) {
          state.jobs = action.payload.jobs;
        } else {
          state.jobs.push(...action.payload.jobs);
        }
        state.hasMore = action.payload.hasMore;
        state.page = action.payload.page;
      })
      .addCase(fetchJobs.rejected, (state) => {
        state.isLoading = false;
      })
      
      // Search jobs cases
      .addCase(searchJobs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload.jobs;
        state.searchQuery = action.payload.query;
        state.page = 1;
        state.hasMore = true;
      })
      .addCase(searchJobs.rejected, (state) => {
        state.isLoading = false;
      })
      
      // Load saved jobs cases
      .addCase(loadSavedJobs.fulfilled, (state, action) => {
        state.savedJobs = action.payload;
      })
      
      // Load recently viewed cases
      .addCase(loadRecentlyViewed.fulfilled, (state, action) => {
        state.recentlyViewed = action.payload;
      })
      
      // Save job cases
      .addCase(saveJob.fulfilled, (state, action) => {
        state.savedJobs = action.payload;
      })
      
      // Unsave job cases
      .addCase(unsaveJob.fulfilled, (state, action) => {
        state.savedJobs = action.payload;
      })
      
      // Add to recently viewed cases
      .addCase(addToRecentlyViewed.fulfilled, (state, action) => {
        state.recentlyViewed = action.payload;
      });
  },
});

export const { setSearchQuery, setFilters, clearJobs, resetJobsState } = jobsSlice.actions;
export default jobsSlice.reducer;