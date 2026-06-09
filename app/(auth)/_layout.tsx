import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/colors';

export default function AuthLayout() {
  const { user } = useAuth();
  if (user) return <Redirect href="/(tabs)" />;
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }} />
  );
}
