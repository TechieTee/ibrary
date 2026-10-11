/**
 * Design tokens pulled from the iBrary Figma file via Dev Mode MCP.
 *
 * Source frames:
 *  - Light: https://www.figma.com/design/lTq3fWotG8MQ6FJ0Myhbxc/iBrary-Design-File?node-id=661-16308&m=dev
 *  - Dark:  https://www.figma.com/design/lTq3fWotG8MQ6FJ0Myhbxc/iBrary-Design-File?node-id=661-16309&m=dev
 *
 * Do not hand-edit color/type values here — re-pull from Figma and regenerate
 * instead, so this file stays in sync with the design source of truth.
 */

export type ThemeMode = 'light' | 'dark';

// 'high' = the Legibility screen's "Contrast +" toggle. No Figma frame for
// this exists yet — palette below is a reasonable hand-generated stand-in
// (pure white/black surfaces, near-black/white text, saturated accents),
// not pulled from design. Replace with real values once Figma has them.
export type ContrastMode = 'normal' | 'high';

// ---------------------------------------------------------------------------
// Color
// ---------------------------------------------------------------------------

export interface ColorTokens {
  greyscale: {
    white: string;
    bgLight: string;
    bgDarken: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    stroke: string;
    dividers: string;
    disabledBg: string;
  };
  accent1: {
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
  };
  accent2: {
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
  };
  system: {
    success: string;
    error: string;
    errorTertiary: string;
    /** Only defined in the light variant in Figma; falls back to `error` in dark. */
    errorHover: string;
  };
}

export const lightColors: ColorTokens = {
  greyscale: {
    white: '#FFFFFF', // Light/Greyscale/White
    bgLight: '#FFFFFF', // Light/Greyscale/Bg-Light
    bgDarken: '#F8F8F8', // Light/Greyscale/Bg-darken
    textPrimary: '#181818', // Light/Greyscale/Text-primary
    textSecondary: '#5C5C5C', // Light/Greyscale/Text-secondary
    textTertiary: '#747474', // Light/Greyscale/Text-tertiary
    stroke: '#D7D7D7', // Light/Greyscale/Stroke
    dividers: '#EDEDED', // Light/Greyscale/Dividers
    disabledBg: '#EFEFEF', // Light/Greyscale/Disabled bg
  },
  accent1: {
    primary: '#E06D0C', // Light/Assents/Accent1-primary
    secondary: '#E68A3D', // Light/Assents/Accent1-secondary
    tertiary: '#ECA76D', // Light/Assents/Accent1-tertiary
    quaternary: '#EDE9F2', // Light/Assents/Accent1-quaternary
  },
  accent2: {
    primary: '#4E2680', // Light/Assents/Accent2-primary
    secondary: '#957DB3', // Light/Assents/Accent2-secondary
    tertiary: '#CABED9', // Light/Assents/Accent2-tertiary
    quaternary: '#EDE9F2', // Light/Assents/Accent2-quaternary
  },
  system: {
    success: '#3AC922', // Light/System error/Successful
    error: '#FF3030', // Light/System error/Error
    errorTertiary: '#FFF2F2', // Light/System error/Error-tertiary
    errorHover: '#ED2121', // Light/System error/Error-hover
  },
};

export const darkColors: ColorTokens = {
  greyscale: {
    white: '#FFFFFF', // Dark/Grayscale/White
    bgLight: '#282828', // Dark/Grayscale/Bg-light
    bgDarken: '#1C1C1C', // Dark/Grayscale/Bg-darken
    textPrimary: '#D9D9D9', // Dark/Grayscale/Text-primary
    textSecondary: '#9D9D9D', // Dark/Grayscale/Text-secondary
    textTertiary: '#5C5C5C', // Dark/Grayscale/Text-tertiary
    stroke: '#3A3A3A', // Dark/Grayscale/Stroke
    dividers: '#323232', // Dark/Grayscale/Dividers
    disabledBg: '#4A4A4A', // Dark/Grayscale/disabled bg
  },
  accent1: {
    primary: '#E26F0E', // Dark/Assents/Accent1-primary
    secondary: '#F3C59E', // Dark/Assents/Accent1-secondary
    tertiary: '#F3C59E', // Dark/Assents/Accent1-tertiary
    quaternary: '#EDE9F2', // Dark/Assents/Accent2-quaternary (Accent1-quaternary not defined in dark set; reused)
  },
  accent2: {
    primary: '#A67ADC', // Dark/Assents/Accent2-primary
    secondary: '#B8A8CC', // Dark/Assents/Accent2-secondary
    tertiary: '#DCD4E6', // Dark/Assents/Accent2-tertiary
    quaternary: '#EDE9F2', // Dark/Assents/Accent2-quaternary
  },
  system: {
    success: '#4DA63E', // Dark/System error/Successful
    error: '#FF4545', // Dark/System error/Error
    errorTertiary: '#FBDFDF', // Dark/System error/Error-tertiary
    // Not defined as a separate variable in the dark collection — falls back to `error`.
    errorHover: '#FF4545',
  },
};

// No Figma frame for high-contrast exists yet — hand-generated stand-in
// palette: pure white background, near-black text, saturated accents,
// strong (near-black) borders/dividers for maximum edge visibility.
export const highContrastLightColors: ColorTokens = {
  greyscale: {
    white: '#FFFFFF',
    bgLight: '#FFFFFF',
    bgDarken: '#F0F0F0',
    textPrimary: '#000000',
    textSecondary: '#1A1A1A',
    textTertiary: '#333333',
    stroke: '#000000',
    dividers: '#000000',
    disabledBg: '#E0E0E0',
  },
  accent1: {
    primary: '#CC5200',
    secondary: '#A83D00',
    tertiary: '#7A2C00',
    quaternary: '#FFE0CC',
  },
  accent2: {
    primary: '#3D1A66',
    secondary: '#2A0F4D',
    tertiary: '#1A0933',
    quaternary: '#E5D9F2',
  },
  system: {
    success: '#008000',
    error: '#CC0000',
    errorTertiary: '#FFE5E5',
    errorHover: '#990000',
  },
};

// Hand-generated stand-in (see highContrastLightColors above): pure black
// background, near-white text, saturated accents bright enough to read on
// black, strong (near-white) borders/dividers.
export const highContrastDarkColors: ColorTokens = {
  greyscale: {
    white: '#FFFFFF',
    bgLight: '#000000',
    bgDarken: '#0D0D0D',
    textPrimary: '#FFFFFF',
    textSecondary: '#E6E6E6',
    textTertiary: '#CCCCCC',
    stroke: '#FFFFFF',
    dividers: '#FFFFFF',
    disabledBg: '#1A1A1A',
  },
  accent1: {
    primary: '#FF8C1A',
    secondary: '#FFA64D',
    tertiary: '#FFC080',
    quaternary: '#4D2600',
  },
  accent2: {
    primary: '#B380FF',
    secondary: '#C9A3FF',
    tertiary: '#E0C7FF',
    quaternary: '#3D1A66',
  },
  system: {
    success: '#00E600',
    error: '#FF3333',
    errorTertiary: '#4D0000',
    errorHover: '#FF6666',
  },
};

// "Sandow Gray" — a separate Figma variable collection used only on the
// Splash and Loading Quote screens (nodes 533:26975/654:22399 light,
// 661:16310/661:16311 dark). Doesn't fold into `greyscale` above since it
// doesn't share that collection's values — dark Sandow Gray/100 (#111214)
// has no equivalent among Dark/Grayscale/*, and light Sandow Gray/100
// (#FBF1F1) isn't Light/Greyscale/White (#FFFFFF) either.
export interface LaunchColors {
  /** Sandow Gray/100 */
  bg: string;
  /** Sandow Gray/White */
  white: string;
}

export const lightLaunchColors: LaunchColors = {
  bg: '#FBF1F1',
  white: '#FFFFFF',
};

export const darkLaunchColors: LaunchColors = {
  bg: '#111214',
  white: '#FFFFFF',
};

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------
// HeaderText/Display use Campton, BodyText uses Manrope. Identical across both
// light and dark frames (type is mode-independent), so there is a single set.

export interface FontToken {
  fontFamily: string;
  fontSize: number;
  fontWeight:
    | '400'
    | '500'
    | '600'
    | '700';
  lineHeight: number;
  letterSpacing: number;
}

// Explicit shape (rather than `as const` + `typeof typography`) so the
// leaf FontToken fields stay plain `number`/union types instead of frozen
// numeric literals — scaleTypography() below needs to return recomputed
// numbers that still satisfy this type.
export interface TypographyScale {
  header: {
    xs: { semibold: FontToken };
    sm: { medium: FontToken; semibold: FontToken };
    base: { medium: FontToken; semibold: FontToken; bold: FontToken };
    lg: { medium: FontToken; semibold: FontToken; bold: FontToken };
    xl1: { semibold: FontToken; bold: FontToken };
    xl2: { semibold: FontToken; bold: FontToken };
    xl3: { semibold: FontToken };
  };
  display: {
    xs: { semibold: FontToken; bold: FontToken };
    sm: { regular: FontToken; semibold: FontToken };
    base: { medium: FontToken; semibold: FontToken };
    lg: { medium: FontToken; semibold: FontToken; bold: FontToken };
    xl1: { semibold: FontToken };
    xl2: { semibold: FontToken };
    xl3: { bold: FontToken };
    xl4: { semibold: FontToken };
    xl5: { semibold: FontToken };
  };
  body: {
    xs: { regular: FontToken };
    sm: { regular: FontToken; medium: FontToken; bold: FontToken };
    base: { regular: FontToken; medium: FontToken; semibold: FontToken };
    lg: { medium: FontToken; semibold: FontToken };
    xl2: { bold: FontToken };
  };
}

export const typography: TypographyScale = {
  header: {
    xs: { semibold: font('Campton', 12, '600', 18) },
    sm: {
      medium: font('Campton', 14, '500', 22),
      semibold: font('Campton', 14, '600', 22),
    },
    base: {
      medium: font('Campton', 16, '500', 26),
      semibold: font('Campton', 16, '600', 26),
      bold: font('Campton', 16, '700', 26),
    },
    lg: {
      medium: font('Campton', 18, '500', 30),
      semibold: font('Campton', 18, '600', 30),
      bold: font('Campton', 18, '700', 30),
    },
    xl1: {
      semibold: font('Campton', 20, '600', 32),
      bold: font('Campton', 20, '700', 32),
    },
    xl2: {
      semibold: font('Campton', 24, '600', 36),
      bold: font('Campton', 24, '700', 36),
    },
    xl3: { semibold: font('Campton', 30, '600', 46) },
  },
  display: {
    xs: {
      semibold: font('Campton', 12, '600', 18),
      bold: font('Campton', 12, '700', 18),
    },
    sm: {
      regular: font('Campton', 14, '400', 22),
      semibold: font('Campton', 14, '600', 22),
    },
    base: {
      medium: font('Campton', 16, '500', 26),
      semibold: font('Campton', 16, '600', 26),
    },
    lg: {
      medium: font('Campton', 18, '500', 30),
      semibold: font('Campton', 18, '600', 30),
      bold: font('Campton', 18, '700', 30),
    },
    xl1: { semibold: font('Campton', 20, '600', 32) },
    xl2: { semibold: font('Campton', 24, '600', 36) },
    xl3: { bold: font('Campton', 30, '700', 46) },
    xl4: { semibold: font('Campton', 36, '600', 52) },
    xl5: { semibold: font('Campton', 48, '600', 72) },
  },
  body: {
    xs: { regular: font('Manrope', 12, '400', 18) },
    sm: {
      regular: font('Manrope', 14, '400', 22),
      medium: font('Manrope', 14, '500', 22),
      bold: font('Manrope', 14, '700', 22),
    },
    base: {
      regular: font('Manrope', 16, '400', 20),
      medium: font('Manrope', 16, '500', 20),
      semibold: font('Manrope', 16, '600', 20),
    },
    lg: {
      medium: font('Manrope', 18, '500', 30),
      semibold: font('Manrope', 18, '600', 30),
    },
    xl2: { bold: font('Manrope', 24, '700', 36) },
  },
};

function font(
  fontFamily: string,
  fontSize: number,
  fontWeight: FontToken['fontWeight'],
  lineHeight: number,
  letterSpacing: number = 0, // matches Figma: every pulled Font(...) definition has letterSpacing: 0
): FontToken {
  return { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing };
}

// ---------------------------------------------------------------------------
// Typography scaling — Legibility screen toggles
// ---------------------------------------------------------------------------
// Applied on top of whichever base theme (light/dark × normal/high-contrast)
// is active — these never replace colors, spacing, radii or shadows, only
// recompute typography. No Figma spec exists for these multipliers; they're
// reasonable stand-ins pending real design values.

// Common single-step "larger text" bump — not WCAG-mandated, just a
// conventional default (matches e.g. a single OS text-size increment).
const BIGGER_TEXT_SCALE = 1.25;

// Extra line-height multiplier, layered on top of any biggerText scaling
// (so line-height stays proportional to font size before this is applied).
const LINE_HEIGHT_SCALE = 1.3;

// WCAG 2.1 SC 1.4.12 (Text Spacing) recommends letter-spacing of at least
// 0.12x font size.
const TEXT_SPACING_RATIO = 0.12;

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

type TypographyNode = FontToken | { [key: string]: TypographyNode };

function isFontToken(node: TypographyNode): node is FontToken {
  return typeof (node as FontToken).fontSize === 'number';
}

function mapFontTokens(node: TypographyNode, transform: (token: FontToken) => FontToken): TypographyNode {
  if (isFontToken(node)) {
    return transform(node);
  }
  const result: { [key: string]: TypographyNode } = {};
  for (const key of Object.keys(node)) {
    result[key] = mapFontTokens(node[key], transform);
  }
  return result;
}

export interface TypographyScaleOptions {
  biggerText?: boolean;
  textSpacing?: boolean;
  lineHeight?: boolean;
}

/**
 * Recomputes every FontToken in a typography scale according to the
 * Legibility screen's toggles:
 *  - biggerText: scales fontSize (and, to stay proportional, lineHeight)
 *  - lineHeight: an additional line-height multiplier on top of that
 *  - textSpacing: sets letterSpacing relative to the (possibly scaled) fontSize
 *
 * Returns `base` unchanged (same reference) if every option is off.
 */
export function scaleTypography(base: TypographyScale, options: TypographyScaleOptions): TypographyScale {
  const { biggerText = false, textSpacing = false, lineHeight = false } = options;
  if (!biggerText && !textSpacing && !lineHeight) {
    return base;
  }

  const fontScale = biggerText ? BIGGER_TEXT_SCALE : 1;
  const lineHeightScale = lineHeight ? LINE_HEIGHT_SCALE : 1;

  return mapFontTokens(base as unknown as TypographyNode, (token) => {
    const fontSize = round(token.fontSize * fontScale);
    return {
      ...token,
      fontSize,
      lineHeight: round(token.lineHeight * fontScale * lineHeightScale),
      letterSpacing: textSpacing ? round(fontSize * TEXT_SPACING_RATIO) : token.letterSpacing,
    };
  }) as unknown as TypographyScale;
}

// ---------------------------------------------------------------------------
// Spacing & radius
// ---------------------------------------------------------------------------
// Figma only exposes border-radius variables on these frames (no explicit
// spacing/gap scale was published as variables). Radii below are pulled
// directly; spacing uses a conventional 4px scale as a placeholder until a
// spacing variable collection exists in Figma — replace when available.

export const radii = {
  md: 12, // Sizes/Border Radius/BR 4
  xl: 16, // radius-2xl
  // Not backed by a Figma variable — the Legibility frame (654:23977) uses a
  // literal 24px corner radius on its feature cards and close button.
  lg: 24,
  // Pill/fully-rounded shape. Figma's CTA button uses borderRadius: 56
  // (== its own height) to achieve this; 9999 is the standard "always
  // fully round, regardless of box height" value, so it isn't tied to one
  // specific button's height like the literal 56 would be.
  full: 9999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xl2: 32,
  xl3: 40,
} as const;

// Fixed-size UI elements that aren't part of the spacing scale (not
// paddings/gaps — literal widths/heights of specific components). Not
// backed by Figma variables; pulled directly from the Legibility frame.
export const sizes = {
  ctaButtonHeight: 56, // "Buttons - CTA" (647:24479)
  closeButton: 48, // close (X) button (647:24441)
} as const;

// ---------------------------------------------------------------------------
// Shadows
// ---------------------------------------------------------------------------

export interface ShadowToken {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export const shadows = {
  // Default Shadow/Default - XS
  xs: {
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  } satisfies ShadowToken,
  // Shadows/shadow-lg (first of the two stacked drop shadows; RN supports one)
  lg: {
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  } satisfies ShadowToken,
} as const;

// ---------------------------------------------------------------------------
// Composed themes
// ---------------------------------------------------------------------------

export interface Theme {
  mode: ThemeMode;
  colors: ColorTokens;
  launch: LaunchColors;
  typography: typeof typography;
  spacing: typeof spacing;
  radii: typeof radii;
  sizes: typeof sizes;
  shadows: typeof shadows;
}

export const lightTheme: Theme = {
  mode: 'light',
  colors: lightColors,
  launch: lightLaunchColors,
  typography,
  spacing,
  radii,
  sizes,
  shadows,
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: darkColors,
  launch: darkLaunchColors,
  typography,
  spacing,
  radii,
  sizes,
  shadows,
};

// `mode` stays 'light'/'dark' — contrast is a separate axis (see
// ContrastMode) layered on top of, not replacing, light/dark.
export const highContrastLightTheme: Theme = {
  mode: 'light',
  colors: highContrastLightColors,
  launch: lightLaunchColors,
  typography,
  spacing,
  radii,
  sizes,
  shadows,
};

export const highContrastDarkTheme: Theme = {
  mode: 'dark',
  colors: highContrastDarkColors,
  launch: darkLaunchColors,
  typography,
  spacing,
  radii,
  sizes,
  shadows,
};
