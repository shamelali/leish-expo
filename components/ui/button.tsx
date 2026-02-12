import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

export interface ButtonProps {
  onPress?: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
}

export function Button({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  testID,
}: ButtonProps) {
  const primaryColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const getBackgroundColor = () => {
    if (disabled) return backgroundColor;
    switch (variant) {
      case 'primary':
        return primaryColor;
      case 'secondary':
        return backgroundColor;
      case 'danger':
        return '#dc2626';
      default:
        return primaryColor;
    }
  };

  const getTextColor = () => {
    if (variant !== 'secondary') {
      return '#fff';
    }
    return textColor;
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 16 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 24 };
      case 'medium':
      default:
        return { paddingVertical: 12, paddingHorizontal: 20 };
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          opacity: pressed ? 0.8 : 1,
          ...getSizeStyles(),
        },
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <ThemedText
          style={{
            color: getTextColor(),
            fontWeight: '600',
          }}
        >
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
});
