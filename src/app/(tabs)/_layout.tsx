import { Tabs } from 'expo-router';
import { Activity, CircleDot, Bike, User } from 'lucide-react-native';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  // Calculate dynamic bottom padding to clear the Android nav bar/gesture line
  const bottomPadding = Platform.OS === 'android' ? Math.max(insets.bottom, 8) : insets.bottom;
  const barHeight = 60 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#111827' },
        headerTintColor: '#F9FAFB',
        headerTitleStyle: { fontWeight: '800', letterSpacing: 1 },
        tabBarStyle: {
          backgroundColor: '#111827',
          borderTopColor: '#1F2937',
          height: barHeight,
          paddingBottom: bottomPadding,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#00F5D4',
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'FEED',
          tabBarLabel: 'Feed',
          tabBarIcon: ({ color, size }) => <Activity color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          title: 'RECORD',
          tabBarLabel: 'Record',
          tabBarIcon: ({ color, size }) => <CircleDot color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="garage"
        options={{
          title: 'GARAGE',
          tabBarLabel: 'Garage',
          tabBarIcon: ({ color, size }) => <Bike color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'PROFILE',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}