import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export interface LoaderProps {
  size?: 'small' | 'large';
  message?: string;
  fullScreen?: boolean;
}

export function Loader({ size = 'large', message, fullScreen = false }: LoaderProps) {
  const tintColor = useThemeColor({}, 'tint');

  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={tintColor} />
      {message && <ThemedText style={styles.message}>{message}</ThemedText>}
    </View>
  );
}

export interface SkeletonProps {
  width?: string | number;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  return (
    <View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  fullScreen: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    opacity: 0.6,
  },
  skeleton: {
    backgroundColor: '#e5e7eb',
  },
});
