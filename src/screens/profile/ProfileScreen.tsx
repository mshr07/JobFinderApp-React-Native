import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch } from '../../store';
import { logoutUser } from '../../store/slices/authSlice';
import { COLORS, SIZES } from '../../constants';

const ProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.text}>User profile and settings will appear here.</Text>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: SIZES.paddingHorizontal },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.label, marginBottom: 16 },
  text: { fontSize: 16, color: COLORS.secondaryLabel, textAlign: 'center', marginBottom: 40 },
  logoutButton: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: SIZES.borderRadius,
  },
  logoutButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;