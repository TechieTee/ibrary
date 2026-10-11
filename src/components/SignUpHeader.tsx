import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';

// Shared "Top Header" bar (back arrow + centered title + bottom stroke)
// used across every signup-flow screen in Figma. Padded by the device's
// safe-area top inset so the row clears the status bar/notch instead of
// sitting flush against the top edge.

const ROW_HEIGHT = 56;

interface Props {
  title: string;
  onBack: () => void;
}

export function SignUpHeader({ title, onBack }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.greyscale.stroke,
      }}
    >
      <View style={{ height: insets.top }} />
      <View
        style={{
          height: ROW_HEIGHT,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: theme.spacing.lg,
        }}
      >
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={{ width: 24, height: 24, justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 20, color: theme.colors.greyscale.textPrimary }}>‹</Text>
        </Pressable>
        <Text
          style={{
            ...theme.typography.header.lg.semibold,
            color: theme.colors.greyscale.textPrimary,
            position: 'absolute',
            left: 0,
            right: 0,
            textAlign: 'center',
          }}
        >
          {title}
        </Text>
      </View>
    </View>
  );
}
