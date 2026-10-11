import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { useThemeStore } from '../store/themeStore';

// The "Dark/Light Theme" pill that appears on every signup/onboarding
// frame in Figma (mountain/sky scene switch). Approximated as a themed
// sun/moon pill wired to the real useThemeStore, same reasoning as
// OnboardingScreen's version — the exact multi-layer graphic isn't a
// single exportable asset and this project's SVG pipeline isn't wired up.

export function ThemeTogglePill() {
  const theme = useTheme();
  const mode = useThemeStore((state) => state.mode);
  const toggleMode = useThemeStore((state) => state.toggleMode);

  return (
    <Pressable
      onPress={toggleMode}
      accessibilityRole="switch"
      accessibilityLabel="Toggle dark mode"
      accessibilityState={{ checked: mode === 'dark' }}
      style={{
        width: 64,
        height: 36,
        borderRadius: theme.radii.full,
        backgroundColor: theme.colors.greyscale.white,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.xs,
      }}
    >
      <Ionicons name={mode === 'dark' ? 'moon' : 'sunny'} size={18} color={theme.colors.greyscale.textPrimary} />
    </Pressable>
  );
}
