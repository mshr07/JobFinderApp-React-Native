import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { COLORS, SIZES } from '../../constants';

const JobDetailsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { jobId } = route.params as { jobId: string };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Job Details</Text>
        <Text style={styles.subtitle}>Job ID: {jobId}</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Information</Text>
          <Text style={styles.text}>
            This screen will show detailed job information including:
          </Text>
          <Text style={styles.bulletPoint}>• Full job description</Text>
          <Text style={styles.bulletPoint}>• Company information</Text>
          <Text style={styles.bulletPoint}>• Requirements and qualifications</Text>
          <Text style={styles.bulletPoint}>• Salary details</Text>
          <Text style={styles.bulletPoint}>• Application process</Text>
        </View>

        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Apply Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.paddingHorizontal,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.label,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.secondaryLabel,
    marginBottom: 30,
  },
  section: {
    backgroundColor: COLORS.cardBackground,
    padding: 16,
    borderRadius: SIZES.borderRadius,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.label,
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    color: COLORS.secondaryLabel,
    lineHeight: 20,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 14,
    color: COLORS.secondaryLabel,
    lineHeight: 24,
    marginLeft: 16,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: SIZES.borderRadius,
    alignItems: 'center',
    marginTop: 20,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.background,
  },
});

export default JobDetailsScreen;