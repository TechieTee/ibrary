// src/components/StateView.tsx
import React from 'react';
import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import { useTheme } from '../theme';
import { IbraryError } from '../api/types';

interface StateViewProps {
  status: 'loading' | 'empty' | 'error' | 'session-expired';
  error?: IbraryError;
  onRetry?: () => void;
}

const errorMessages: Record<IbraryError['type'], string> = {
  not_found: 'This content couldn\'t be found.',
  invalid_upstream: 'Something went wrong loading this content.',
  temporary_outage: 'Content is temporarily unavailable. Please try again.',
};

export function StateView({ status, error, onRetry }: StateViewProps) {
  const theme = useTheme();

  if (status === 'loading') {
    return (
      <View accessibilityRole="progressbar" accessibilityLabel="Loading content">
        <ActivityIndicator color={theme.colors.greyscale.textPrimary} />
      </View>
    );
  }

  if (status === 'empty') {
    return (
      <View accessibilityRole="text">
        <Text style={{ color: theme.colors.greyscale.textSecondary }}>No content available yet.</Text>
      </View>
    );
  }

  if (status === 'session-expired') {
    return (
      <View accessibilityRole="alert">
        <Text style={{ color: theme.colors.greyscale.textPrimary }}>Your session has expired.</Text>
        {onRetry && (
          <Pressable onPress={onRetry} accessibilityRole="button" accessibilityLabel="Log in again">
            <Text style={{ color: theme.colors.accent1.primary }}>Log in again</Text>
          </Pressable>
        )}
      </View>
    );
  }

  // error
  return (
    <View accessibilityRole="alert">
      <Text style={{ color: theme.colors.greyscale.textPrimary }}>
        {error ? errorMessages[error.type] : 'Something went wrong.'}
      </Text>
      {onRetry && (
        <Pressable onPress={onRetry} accessibilityRole="button" accessibilityLabel="Retry">
          <Text style={{ color: theme.colors.accent1.primary }}>Retry</Text>
        </Pressable>
      )}
    </View>
  );
}