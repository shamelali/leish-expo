import { ThemedText } from '@/components/themed-text';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onDismiss?: () => void;
}

export function Toast({
  message,
  type = 'info',
  duration = 3000,
  onDismiss,
}: ToastProps) {
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(duration),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss?.();
    });
  }, [opacity, duration, onDismiss]);

  const backgroundColor = {
    success: '#d1fae5',
    error: '#fee2e2',
    info: '#dbeafe',
    warning: '#fef3c7',
  }[type];

  const textColor = {
    success: '#065f46',
    error: '#991b1b',
    info: '#0c4a6e',
    warning: '#92400e',
  }[type];

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity, backgroundColor },
      ]}
    >
      <ThemedText style={[styles.message, { color: textColor }]}>
        {message}
      </ThemedText>
    </Animated.View>
  );
}

export interface ToastManagerProps {
  toasts: ToastProps[];
  onRemove: (index: number) => void;
}

export function ToastManager({ toasts, onRemove }: ToastManagerProps) {
  return (
    <View style={styles.manager}>
      {toasts.map((toast, index) => (
        <Toast
          key={index}
          {...toast}
          onDismiss={() => onRemove(index)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
  },
  manager: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
});
