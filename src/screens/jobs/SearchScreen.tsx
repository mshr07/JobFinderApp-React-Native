import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../store';
import { searchJobs, addToRecentlyViewed, saveJob } from '../../store/slices/jobsSlice';
import { COLORS, SIZES, JOB_CATEGORIES, JOB_TYPES } from '../../constants';
import SearchBar from '../../components/common/SearchBar';
import JobCard from '../../components/job/JobCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Job } from '../../types';

const SearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { jobs, isLoading, savedJobs } = useAppSelector((state) => state.jobs);
  
  const [searchResults, setSearchResults] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (query: string) => {
    if (query.trim().length === 0) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setSearchQuery(query);
    setHasSearched(true);
    
    try {
      const result = await dispatch(searchJobs({ query, filters: {} })).unwrap();
      setSearchResults(result.data);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  }, [dispatch]);

  const handleJobPress = useCallback((job: Job) => {
    dispatch(addToRecentlyViewed(job));
    navigation.navigate('JobDetails' as never, { jobId: job.id } as never);
  }, [dispatch, navigation]);

  const handleSaveJob = useCallback(async (job: Job) => {
    try {
      await dispatch(saveJob(job)).unwrap();
    } catch (error) {
      console.error('Save job error:', error);
    }
  }, [dispatch]);

  const isJobSaved = useCallback((jobId: string) => {
    return savedJobs.some(savedJob => savedJob.id === jobId);
  }, [savedJobs]);

  const handleCategoryPress = (category: string) => {
    handleSearch(category);
  };

  const renderJobCard = ({ item }: { item: Job }) => (
    <JobCard
      job={item}
      onPress={handleJobPress}
      onSave={handleSaveJob}
      isSaved={isJobSaved(item.id)}
    />
  );

  const renderCategory = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.categoryButton}
      onPress={() => handleCategoryPress(item)}
    >
      <Text style={styles.categoryText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search Jobs</Text>
        <SearchBar
          value={searchQuery}
          onSearch={handleSearch}
          placeholder="Search jobs, companies, skills..."
          showFilterButton={false}
        />
      </View>

      {!hasSearched ? (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Popular Categories</Text>
          <FlatList
            data={JOB_CATEGORIES.slice(0, 6)}
            renderItem={renderCategory}
            keyExtractor={(item) => item}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          />

          <Text style={styles.sectionTitle}>Job Types</Text>
          <FlatList
            data={JOB_TYPES}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.typeButton}
                onPress={() => handleSearch(item)}
              >
                <Text style={styles.typeText}>{item.replace('-', ' ').toUpperCase()}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.typesContainer}
          />
        </View>
      ) : (
        <View style={styles.resultsContainer}>
          {isLoading ? (
            <LoadingSpinner message="Searching jobs..." />
          ) : (
            <>
              <Text style={styles.resultsTitle}>
                {searchResults.length} results for "{searchQuery}"
              </Text>
              <FlatList
                data={searchResults}
                renderItem={renderJobCard}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={styles.emptyResults}>
                    <Text style={styles.emptyTitle}>No jobs found</Text>
                    <Text style={styles.emptyText}>
                      Try different keywords or browse categories above.
                    </Text>
                  </View>
                }
              />
            </>
          )}
        </View>
      )}
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
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.label,
    marginBottom: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.paddingHorizontal,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.label,
    marginTop: 24,
    marginBottom: 12,
  },
  categoriesContainer: {
    paddingBottom: 16,
  },
  categoryButton: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    margin: 4,
    padding: 16,
    borderRadius: SIZES.borderRadius,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.label,
    textAlign: 'center',
  },
  typesContainer: {
    paddingBottom: 16,
  },
  typeButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.background,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.label,
    paddingHorizontal: SIZES.paddingHorizontal,
    paddingVertical: 12,
  },
  emptyResults: {
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
  emptyText: {
    fontSize: 14,
    color: COLORS.secondaryLabel,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SearchScreen;