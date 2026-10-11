import { useMemo } from 'react';
import { useThemeStore } from '../store/themeStore';
import { useLegibilityStore } from '../store/legibilityStore';
import {
  type Theme,
  type ThemeMode,
  type ContrastMode,
  type ColorTokens,
  type LaunchColors,
  type FontToken,
  type ShadowToken,
  lightTheme,
  darkTheme,
  highContrastLightTheme,
  highContrastDarkTheme,
  scaleTypography,
  typography,
  spacing,
  radii,
  sizes,
  shadows,
} from './tokens';

// Deliberately NOT `export * from './tokens'`: that would also re-export
// `lightColors` / `darkColors` / `lightTheme` / `darkTheme` /
// `highContrastLightTheme` / `highContrastDarkTheme`, letting a component
// import a single mode/contrast combination directly and bypass
// `useTheme()`. Only mode-agnostic tokens and types are part of the public
// API below — the active theme is only reachable through the hook, which
// resolves mode from `useThemeStore` and contrast/typography-scaling
// flags from `useLegibilityStore` for you.

/**
 * Returns the active theme — colors, typography, spacing, radii and
 * shadows — resolved from:
 *  - `useThemeStore`'s `mode` and `useLegibilityStore`'s `contrastPlus`,
 *    picking the correct one of four base theme objects (light / dark ×
 *    normal / high contrast);
 *  - then `useLegibilityStore`'s `biggerText` / `textSpacing` / `lineHeight`,
 *    which scale that base theme's typography (font size, letter-spacing,
 *    line-height) without touching its colors, spacing, radii or shadows.
 *
 * Note: `smartContrast` in `useLegibilityStore` is intentionally not wired
 * up here yet — it's stored but has no effect until its behavior is
 * confirmed.
 */
export function useTheme(): Theme {
  const mode = useThemeStore((state) => state.mode);
  const contrastPlus = useLegibilityStore((state) => state.contrastPlus);
  const biggerText = useLegibilityStore((state) => state.biggerText);
  const textSpacing = useLegibilityStore((state) => state.textSpacing);
  const lineHeight = useLegibilityStore((state) => state.lineHeight);

  const baseTheme = contrastPlus
    ? mode === 'dark'
      ? highContrastDarkTheme
      : highContrastLightTheme
    : mode === 'dark'
      ? darkTheme
      : lightTheme;

  return useMemo(() => {
    if (!biggerText && !textSpacing && !lineHeight) {
      return baseTheme;
    }
    return {
      ...baseTheme,
      typography: scaleTypography(baseTheme.typography, { biggerText, textSpacing, lineHeight }),
    };
  }, [baseTheme, biggerText, textSpacing, lineHeight]);
}

export type { Theme, ThemeMode, ContrastMode, ColorTokens, LaunchColors, FontToken, ShadowToken };
export { typography, spacing, radii, sizes, shadows };
