import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../constants';

const SearchScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Search</Text>
        <Text style={styles.text}>Advanced search functionality will be implemented here.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: SIZES.paddingHorizontal },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.label, marginBottom: 16 },
  text: { fontSize: 16, color: COLORS.secondaryLabel, textAlign: 'center' },
});

export default SearchScreen;