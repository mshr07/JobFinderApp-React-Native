import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { useAppDispatch, useAppSelector } from '../../store';
import { fetchJobs, loadSavedJobs, saveJob, unsaveJob, addToRecentlyViewed } from '../../store/slices/jobsSlice';
import { Job } from '../../types';
import { COLORS, SIZES, ROUTES } from '../../constants';
import JobCard from '../../components/job/JobCard';
import SearchBar from '../../components/common/SearchBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const JobListScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  const { 
    jobs, 
    savedJobs, 
    isLoading, 
    searchQuery, 
    hasMore, 
    page 
  } = useAppSelector((state) => state.jobs);
  
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Load initial data
    console.log('JobListScreen: Loading initial data...');
    dispatch(fetchJobs({ page: 1 }))
      .unwrap()
      .then((result) => {
        console.log('JobListScreen: Jobs loaded successfully:', result.data.length);
      })
      .catch((error) => {
        console.error('JobListScreen: Error loading jobs:', error);
        Alert.alert('Error', 'Failed to load jobs. Please try again.');
      });
    dispatch(loadSavedJobs());
  }, [dispatch]);

  const handleSearch = useCallback((query: string) => {
    dispatch(fetchJobs({ page: 1, searchQuery: query }));
  }, [dispatch]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchJobs({ page: 1, searchQuery })).unwrap();
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh jobs');
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, searchQuery]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      dispatch(fetchJobs({ page: page + 1, searchQuery }));
    }
  }, [dispatch, isLoading, hasMore, page, searchQuery]);

  const handleJobPress = useCallback((job: Job) => {
    // Add to recently viewed
    dispatch(addToRecentlyViewed(job));
    
    // Navigate to job details
    navigation.navigate(ROUTES.JOB_DETAILS as never, { jobId: job.id } as never);
  }, [dispatch, navigation]);

  const handleSaveJob = useCallback(async (job: Job) => {
    try {
      await dispatch(saveJob(job)).unwrap();
      Alert.alert('Success', `${job.title} has been saved!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to save job');
    }
  }, [dispatch]);

  const handleUnsaveJob = useCallback(async (jobId: string) => {
    try {
      await dispatch(unsaveJob(jobId)).unwrap();
      Alert.alert('Success', 'Job has been removed from saved!');
    } catch (error) {
      Alert.alert('Error', 'Failed to unsave job');
    }
  }, [dispatch]);

  const isJobSaved = useCallback((jobId: string) => {
    return savedJobs.some(savedJob => savedJob.id === jobId);
  }, [savedJobs]);

  const handleFilterPress = useCallback(() => {
    // Navigate to filter screen or show filter modal
    Alert.alert('Filter', 'Filter functionality will be implemented here');
  }, []);

  const renderJobCard = useCallback(({ item }: { item: Job }) => (
    <JobCard
      job={item}
      onPress={handleJobPress}
      onSave={handleSaveJob}
      onUnsave={handleUnsaveJob}
      isSaved={isJobSaved(item.id)}
    />
  ), [handleJobPress, handleSaveJob, handleUnsaveJob, isJobSaved]);

  const renderLoadingFooter = () => {
    if (!isLoading || page === 1) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading more jobs...</Text>
      </View>
    );
  };

  const renderEmptyState = () => {
    if (isLoading && page === 1) {
      return <LoadingSpinner message="Loading jobs..." />;
    }

    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>No jobs found</Text>
        <Text style={styles.emptySubtitle}>
          {searchQuery ? 
            `No jobs match "${searchQuery}". Try different keywords.` :
            'Check back later for new opportunities.'
          }
        </Text>
      </View>
    );
  };

  const keyExtractor = useCallback((item: Job) => item.id, []);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 200, // Estimated item height
    offset: 200 * index,
    index,
  }), []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Your Dream Job</Text>
        <Text style={styles.headerSubtitle}>
          {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} available
        </Text>
      </View>

      <SearchBar
        value={searchQuery}
        onSearch={handleSearch}
        onFilterPress={handleFilterPress}
        placeholder="Search jobs, companies, locations..."
      />

      <FlatList
        data={jobs}
        renderItem={renderJobCard}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderLoadingFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        style={styles.list}
        contentContainerStyle={jobs.length === 0 ? styles.emptyListContent : undefined}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={5}
        getItemLayout={getItemLayout}
        accessible={true}
        accessibilityLabel="Job listings"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SIZES.paddingHorizontal,
    paddingVertical: 16,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.label,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.secondaryLabel,
  },
  list: {
    flex: 1,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.paddingHorizontal,
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.label,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.secondaryLabel,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.secondaryLabel,
    marginTop: 8,
  },
});

export default JobListScreen;