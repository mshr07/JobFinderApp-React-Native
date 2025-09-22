import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAppDispatch, useAppSelector } from '../store';
import { loadStoredAuth } from '../store/slices/authSlice';
import { COLORS, ROUTES } from '../constants';

// Import screens (we'll create these)
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import JobListScreen from '../screens/jobs/JobListScreen';
import JobDetailsScreen from '../screens/jobs/JobDetailsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SavedJobsScreen from '../screens/jobs/SavedJobsScreen';
import SearchScreen from '../screens/jobs/SearchScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: COLORS.background },
    }}
  >
    <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
    <Stack.Screen name={ROUTES.REGISTER} component={RegisterScreen} />
  </Stack.Navigator>
);

// Job Stack
const JobStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.background,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.cardBorder,
      },
      headerTintColor: COLORS.label,
      headerTitleStyle: {
        fontWeight: '600',
      },
    }}
  >
    <Stack.Screen 
      name={ROUTES.JOB_LIST} 
      component={JobListScreen}
      options={{
        title: 'Jobs',
        headerShown: false, // We'll handle header in the component
      }}
    />
    <Stack.Screen 
      name={ROUTES.JOB_DETAILS} 
      component={JobDetailsScreen}
      options={{
        title: 'Job Details',
        headerBackTitleVisible: false,
      }}
    />
    <Stack.Screen 
      name={ROUTES.SEARCH} 
      component={SearchScreen}
      options={{
        title: 'Search Jobs',
        headerBackTitleVisible: false,
      }}
    />
  </Stack.Navigator>
);

// Profile Stack
const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.background,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.cardBorder,
      },
      headerTintColor: COLORS.label,
      headerTitleStyle: {
        fontWeight: '600',
      },
    }}
  >
    <Stack.Screen 
      name={ROUTES.PROFILE} 
      component={ProfileScreen}
      options={{
        title: 'Profile',
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

// Saved Jobs Stack
const SavedStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.background,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.cardBorder,
      },
      headerTintColor: COLORS.label,
      headerTitleStyle: {
        fontWeight: '600',
      },
    }}
  >
    <Stack.Screen 
      name={ROUTES.SAVED_JOBS} 
      component={SavedJobsScreen}
      options={{
        title: 'Saved Jobs',
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

// Main Tab Navigator
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        switch (route.name) {
          case 'JobsTab':
            iconName = focused ? 'briefcase' : 'briefcase-outline';
            break;
          case 'SearchTab':
            iconName = focused ? 'search' : 'search-outline';
            break;
          case 'SavedTab':
            iconName = focused ? 'bookmark' : 'bookmark-outline';
            break;
          case 'ProfileTab':
            iconName = focused ? 'person' : 'person-outline';
            break;
          default:
            iconName = 'home-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.gray1,
      tabBarStyle: {
        backgroundColor: COLORS.background,
        borderTopColor: COLORS.cardBorder,
        borderTopWidth: 1,
        paddingTop: 8,
        paddingBottom: 8,
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '500',
        marginTop: 4,
      },
    })}
  >
    <Tab.Screen 
      name="JobsTab" 
      component={JobStack} 
      options={{
        tabBarLabel: 'Jobs',
      }}
    />
    <Tab.Screen 
      name="SearchTab" 
      component={SearchScreen} 
      options={{
        tabBarLabel: 'Search',
      }}
    />
    <Tab.Screen 
      name="SavedTab" 
      component={SavedStack} 
      options={{
        tabBarLabel: 'Saved',
      }}
    />
    <Tab.Screen 
      name="ProfileTab" 
      component={ProfileStack} 
      options={{
        tabBarLabel: 'Profile',
      }}
    />
  </Tab.Navigator>
);

// Main App Navigator
const AppNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Load stored auth on app start
    dispatch(loadStoredAuth());
  }, [dispatch]);

  if (isLoading) {
    // You can show a splash screen here
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name={ROUTES.HOME_TABS} component={TabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;