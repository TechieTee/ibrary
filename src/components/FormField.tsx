import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { useTheme } from '../theme';

// Shared "Form fields" pattern pulled from the signup screens' Figma
// frames (label + input + char counter). Reused across SignUpInfoScreen
// and CreatePasswordScreen rather than repeating the same markup.

interface Props extends TextInputProps {
  label: string;
  maxLength?: number;
  rightAccessory?: React.ReactNode;
}

export function FormField({ label, value, maxLength, rightAccessory, style, ...inputProps }: Props) {
  const theme = useTheme();

  return (
    <View style={{ gap: theme.spacing.md, width: '100%' }}>
      <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textPrimary }}>{label}</Text>
      <View
        style={{
          backgroundColor: theme.colors.greyscale.bgDarken,
          borderRadius: theme.radii.md,
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.lg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TextInput
          value={value}
          maxLength={maxLength}
          placeholderTextColor={theme.colors.greyscale.textSecondary}
          style={[
            { flex: 1, ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textPrimary },
            style,
          ]}
          accessibilityLabel={label}
          {...inputProps}
        />
        {rightAccessory}
      </View>
      {maxLength != null && (
        <Text style={{ ...theme.typography.body.xs.regular, color: theme.colors.greyscale.textSecondary, alignSelf: 'flex-end', marginTop: -theme.spacing.sm }}>
          {(value?.length ?? 0)}/{maxLength}
        </Text>
      )}
    </View>
  );
}
