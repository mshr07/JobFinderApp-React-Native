import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Job } from '../../types';
import { COLORS, SIZES, FONTS } from '../../constants';
import { formatDate, formatSalary, truncateText } from '../../utils';

interface JobCardProps {
  job: Job;
  onPress: (job: Job) => void;
  onSave?: (job: Job) => void;
  onUnsave?: (jobId: string) => void;
  isSaved?: boolean;
  showSaveButton?: boolean;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - SIZES.paddingHorizontal * 2;

const JobCard: React.FC<JobCardProps> = ({
  job,
  onPress,
  onSave,
  onUnsave,
  isSaved = false,
  showSaveButton = true,
}) => {
  const scaleValue = useSharedValue(1);
  const saveScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const saveAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: saveScale.value }],
  }));

  const handlePressIn = () => {
    scaleValue.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scaleValue.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handleSave = () => {
    saveScale.value = withTiming(1.2, { duration: 150 }, (finished) => {
      if (finished) {
        saveScale.value = withTiming(1, { duration: 150 });
      }
    });

    if (isSaved && onUnsave) {
      onUnsave(job.id);
    } else if (!isSaved && onSave) {
      onSave(job);
    }
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return COLORS.success;
      case 'part-time': return COLORS.warning;
      case 'contract': return COLORS.secondary;
      case 'remote': return COLORS.primary;
      default: return COLORS.gray1;
    }
  };

  return (
    <Animated.View style={[animatedStyle]}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => onPress(job)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        accessible={true}
        accessibilityLabel={`Job: ${job.title} at ${job.company}`}
        accessibilityHint="Tap to view job details"
      >
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Image
              source={{ uri: job.logo || 'https://via.placeholder.com/50' }}
              style={styles.logo}
              accessibilityLabel={`${job.company} logo`}
            />
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {job.title}
              </Text>
              <Text style={styles.company} numberOfLines={1}>
                {job.company}
              </Text>
            </View>
          </View>
          
          {showSaveButton && (
            <Animated.View style={saveAnimatedStyle}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                accessible={true}
                accessibilityLabel={isSaved ? 'Unsave job' : 'Save job'}
              >
                <Ionicons
                  name={isSaved ? 'bookmark' : 'bookmark-outline'}
                  size={20}
                  color={isSaved ? COLORS.primary : COLORS.gray1}
                />
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>

        <View style={styles.details}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={14} color={COLORS.gray1} />
            <Text style={styles.location}>{job.location}</Text>
          </View>
          
          <View style={[styles.typeContainer, { backgroundColor: getJobTypeColor(job.type) + '20' }]}>
            <Text style={[styles.type, { color: getJobTypeColor(job.type) }]}>
              {job.type.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {truncateText(job.description, 120)}
        </Text>

        <View style={styles.requirements}>
          {job.requirements.slice(0, 3).map((skill, index) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
          {job.requirements.length > 3 && (
            <Text style={styles.moreSkills}>+{job.requirements.length - 3}</Text>
          )}
        </View>

        <View style={styles.footer}>
          <View>
            {job.salary && (
              <Text style={styles.salary}>
                {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
              </Text>
            )}
            <Text style={styles.postedDate}>
              {formatDate(job.postedAt)}
            </Text>
          </View>

          <View style={styles.categoryContainer}>
            <Text style={styles.category}>{job.category}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding,
    marginVertical: 8,
    marginHorizontal: SIZES.marginHorizontal,
    shadowColor: COLORS.label,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    width: CARD_WIDTH,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: COLORS.gray6,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.label,
    marginBottom: 2,
  },
  company: {
    fontSize: 14,
    color: COLORS.secondaryLabel,
  },
  saveButton: {
    padding: 8,
    marginLeft: 8,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  location: {
    fontSize: 13,
    color: COLORS.gray1,
    marginLeft: 4,
  },
  typeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  type: {
    fontSize: 10,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: COLORS.secondaryLabel,
    lineHeight: 20,
    marginBottom: 12,
  },
  requirements: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  skillTag: {
    backgroundColor: COLORS.gray6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  skillText: {
    fontSize: 11,
    color: COLORS.secondaryLabel,
    fontWeight: '500',
  },
  moreSkills: {
    fontSize: 11,
    color: COLORS.gray1,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  salary: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.success,
    marginBottom: 2,
  },
  postedDate: {
    fontSize: 12,
    color: COLORS.gray1,
  },
  categoryContainer: {
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  category: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '500',
  },
});

export default JobCard;