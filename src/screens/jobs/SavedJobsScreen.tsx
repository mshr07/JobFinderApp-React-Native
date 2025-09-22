import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../store';
import { loadSavedJobs, unsaveJob, addToRecentlyViewed } from '../../store/slices/jobsSlice';
import { COLORS, SIZES } from '../../constants';
import JobCard from '../../components/job/JobCard';
import { Job } from '../../types';

const SavedJobsScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { savedJobs } = useAppSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(loadSavedJobs());
  }, [dispatch]);

  const handleJobPress = (job: Job) => {
    dispatch(addToRecentlyViewed(job));
    navigation.navigate('JobDetails' as never, { jobId: job.id } as never);
  };

  const handleUnsaveJob = (jobId: string) => {
    dispatch(unsaveJob(jobId));
  };

  const renderJobCard = ({ item }: { item: Job }) => (
    <JobCard
      job={item}
      onPress={handleJobPress}
      onUnsave={handleUnsaveJob}
      isSaved={true}
    />
  );

  if (savedJobs.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Saved Jobs</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No saved jobs yet</Text>
          <Text style={styles.emptyText}>Jobs you save will appear here for easy access.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Jobs</Text>
        <Text style={styles.subtitle}>{savedJobs.length} saved jobs</Text>
      </View>
      <FlatList
        data={savedJobs}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  header: {
    paddingHorizontal: SIZES.paddingHorizontal,
    paddingVertical: 16,
    backgroundColor: COLORS.background,
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: COLORS.label, 
    marginBottom: 4 
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.secondaryLabel,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.paddingHorizontal,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.label,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.secondaryLabel,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SavedJobsScreen;