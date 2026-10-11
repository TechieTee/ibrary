import React from 'react';
import { View, Text, Pressable, Switch, ScrollView } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { TabParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { useThemeStore } from '../store/themeStore';
import { useLegibilityStore, type LegibilitySettings } from '../store/legibilityStore';

// Built from Figma frame 654:23977 ("Home", Light Dev Mode variant — no
// Dark/* variables are referenced anywhere on this frame, so only a light
// variant exists to pull from; dark mode still resolves correctly through
// useTheme() from the same semantic color keys). Only the Legibility panel
// content is reproduced here — the header and bottom tab bar in that frame
// are already owned by RootNavigator / TabNavigator.
//
// Icon glyphs from the frame (Screen Reader, Contrast+, etc.) are omitted:
// they're Figma-exported SVGs, and the project has no react-native-svg (or
// equivalent) set up yet to render them. Cards are text-only until that's
// wired in — flagging rather than faking a placeholder icon.

type Props = BottomTabScreenProps<TabParamList, 'Legibility'>;

interface FeatureCardConfig {
  key: keyof LegibilitySettings;
  label: string;
}

const FEATURE_CARDS: FeatureCardConfig[] = [
  { key: 'screenReader', label: 'Screen Reader' },
  { key: 'contrastPlus', label: 'Contrast +' },
  { key: 'smartContrast', label: 'Smart Contrast' },
  { key: 'biggerText', label: 'Bigger Text' },
  { key: 'textSpacing', label: 'Text Spacing' },
  { key: 'lineHeight', label: 'Line Height' },
];

export function LegibilityScreen({ navigation }: Props) {
  const theme = useTheme();
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);
  const { toggle, reset, ...settings } = useLegibilityStore();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}
      contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.xl }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: theme.spacing.md,
        }}
      >
        <View style={{ flex: 1, gap: theme.spacing.xs }}>
          <Text
            style={{
              ...theme.typography.header.xl3.semibold,
              color: theme.colors.greyscale.textPrimary,
              textTransform: 'uppercase',
            }}
          >
            Legibility
          </Text>
          <Text style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textSecondary }}>
            Accessible features help everyone read, listen, and understand content.
          </Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate('Home')}
          accessibilityRole="button"
          accessibilityLabel="Close legibility settings"
          style={{
            width: theme.sizes.closeButton,
            height: theme.sizes.closeButton,
            borderRadius: theme.radii.lg,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.system.errorTertiary,
          }}
        >
          <Ionicons name="close" size={18} color={theme.colors.system.error} />
        </Pressable>
      </View>

      {/* Dark theme toggle — wired to the same useThemeStore that drives useTheme() */}
      <View
        style={{
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: theme.colors.greyscale.stroke,
          paddingVertical: theme.spacing.md,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ ...theme.typography.header.lg.semibold, color: theme.colors.greyscale.textPrimary }}>
            Switch to Dark Theme
          </Text>
          <Switch
            value={mode === 'dark'}
            onValueChange={(value) => setMode(value ? 'dark' : 'light')}
            trackColor={{ false: theme.colors.greyscale.stroke, true: theme.colors.accent1.primary }}
            thumbColor={theme.colors.greyscale.white}
            accessibilityLabel="Switch to dark theme"
            accessibilityRole="switch"
          />
        </View>
      </View>

      {/* Feature toggles */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md }}>
        {FEATURE_CARDS.map(({ key, label }) => {
          const selected = settings[key];
          return (
            <Pressable
              key={key}
              onPress={() => toggle(key)}
              accessibilityRole="switch"
              accessibilityLabel={`${label} toggle`}
              accessibilityState={{ checked: selected }}
              style={{
                width: '47%',
                paddingVertical: theme.spacing.xl,
                borderRadius: theme.radii.lg,
                borderWidth: selected ? 2 : 1,
                borderColor: selected ? theme.colors.accent1.primary : theme.colors.greyscale.stroke,
                backgroundColor: theme.colors.greyscale.bgLight,
                alignItems: 'center',
                justifyContent: 'center',
                gap: theme.spacing.sm,
              }}
            >
              <Text
                style={{
                  ...theme.typography.body.base.semibold,
                  color: selected ? theme.colors.accent1.primary : theme.colors.greyscale.textPrimary,
                  textAlign: 'center',
                }}
              >
                {label}
              </Text>
              {selected && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                  <Text style={{ ...theme.typography.body.xs.regular, color: theme.colors.accent1.primary }}>Selected</Text>
                  <Ionicons name="checkmark" size={12} color={theme.colors.accent1.primary} />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Reset */}
      <Pressable
        onPress={reset}
        accessibilityRole="button"
        accessibilityLabel="Reset all accessibility settings"
        style={{
          height: theme.sizes.ctaButtonHeight,
          borderRadius: theme.radii.full,
          borderWidth: 1,
          borderColor: theme.colors.accent1.primary,
          backgroundColor: theme.colors.greyscale.white,
          alignItems: 'center',
          justifyContent: 'center',
          ...theme.shadows.xs,
        }}
      >
        <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.accent1.primary }}>
          Reset All Accessibility Settings
        </Text>
      </Pressable>
    </ScrollView>
  );
}
