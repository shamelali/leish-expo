import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

export interface ErrorProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  details?: string;
}

export function Error({
  title = 'Something went wrong',
  message,
  onRetry,
  details,
}: ErrorProps) {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.errorBox}>
        <View style={styles.errorIcon}>
          <ThemedText style={styles.errorIconText}>⚠️</ThemedText>
        </View>
        <ThemedText type="subtitle" style={styles.title}>
          {title}
        </ThemedText>
        <ThemedText style={[styles.message, { opacity: 0.7 }]}>
          {message}
        </ThemedText>
        {details && (
          <ThemedText style={[styles.details, { opacity: 0.5, fontSize: 12 }]}>
            {details}
          </ThemedText>
        )}
        {onRetry && (
          <Button
            title="Try Again"
            onPress={onRetry}
            variant="primary"
            size="medium"
          />
        )}
      </View>
    </ThemedView>
  );
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Error
          title="Error"
          message={this.state.error?.message || 'An unexpected error occurred'}
          onRetry={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorBox: {
    alignItems: 'center',
    gap: 16,
  },
  errorIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIconText: {
    fontSize: 48,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    fontSize: 14,
  },
  details: {
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  button: {
    marginTop: 8,
    minWidth: 120,
  },
});
