import React, { useEffect } from 'react';
import { Tabs, router, useRootNavigationState } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/colors';
import { Home, QrCode, Wallet, User } from 'lucide-react-native';

export default function TabLayout() {
  const { isAuthenticated } = useAuthStore();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (!isAuthenticated && rootNavigationState?.key) {
      // Only navigate when the root navigation is ready
      router.replace('/(auth)/welcome');
    }
  }, [isAuthenticated, rootNavigationState?.key]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.gray[200],
        },
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTitleStyle: {
          color: colors.text,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="qr-code"
        options={{
          title: 'My QR Code',
          tabBarIcon: ({ color, size }) => <QrCode size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="withdrawals"
        options={{
          title: 'Withdrawals',
          tabBarIcon: ({ color, size }) => <Wallet size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}