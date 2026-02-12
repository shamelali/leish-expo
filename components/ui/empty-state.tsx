import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    title: string;
    onPress: () => void;
  };
  fullScreen?: boolean;
}

export function EmptyState({
  icon = 'inbox',
  title,
  description,
  action,
  fullScreen = false,
}: EmptyStateProps) {
  const textColor = useThemeColor({}, 'text');

  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <Feather name={icon as any} size={48} color={textColor} style={{ opacity: 0.4 }} />
      <ThemedText type="subtitle" style={styles.title}>
        {title}
      </ThemedText>
      {description && (
        <ThemedText style={[styles.description, { color: textColor, opacity: 0.6 }]}>
          {description}
        </ThemedText>
      )}
      {action && (
        <Button
          title={action.title}
          onPress={action.onPress}
          size="medium"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  fullScreen: {
    flex: 1,
  },
  title: {
    marginTop: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 280,
  },
  button: {
    marginTop: 16,
    minWidth: 120,
  },
});
