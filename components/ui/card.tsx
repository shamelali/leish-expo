import { ThemedView } from '@/components/themed-view';
import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

export interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  padding?: number;
  gap?: number;
}

export function Card({ children, onPress, style, padding = 12, gap = 8 }: CardProps) {
  return (
    <ThemedView
      style={[
        styles.card,
        {
          paddingHorizontal: padding,
          paddingVertical: padding,
          gap: gap,
        },
        style,
      ]}
    >
      {children}
    </ThemedView>
  );
}

export interface ListCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  onPress?: () => void;
  rightElement?: ReactNode;
  icon?: ReactNode;
  style?: ViewStyle;
}

export function ListCard({
  title,
  subtitle,
  description,
  onPress,
  rightElement,
  icon,
  style,
}: ListCardProps) {
  const content = (
    <View style={styles.listCardContainer}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <View style={styles.listCardContent}>
        <View style={[styles.titleRow, { justifyContent: rightElement ? 'space-between' : 'flex-start' }]}>
          <View style={{ flex: 1 }}>
            <View style={styles.titleSubtitleRow}>
              {/* Title */}
            </View>
            {description && <View style={styles.description}>{/* Description */}</View>}
          </View>
          {rightElement && <View style={styles.rightElement}>{rightElement}</View>}
        </View>
      </View>
    </View>
  );

  return (
    <Card onPress={onPress} style={[styles.listCard, style]}>
      {content}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginVertical: 8,
  },
  listCardContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listCardContent: {
    flex: 1,
  },
  listCard: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  titleSubtitleRow: {
    gap: 4,
  },
  description: {
    marginTop: 4,
  },
  rightElement: {
    paddingLeft: 12,
  },
});
