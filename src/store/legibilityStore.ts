import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Toggleable accessibility features from the Legibility screen (Figma frame
// 654:23977). "Light Height" on that frame reads as a typo for "Line
// Height" — the icon (format-line-spacing) and feature both point to line
// height, so the key here is `lineHeight`.
export interface LegibilitySettings {
  screenReader: boolean;
  contrastPlus: boolean;
  smartContrast: boolean;
  biggerText: boolean;
  textSpacing: boolean;
  lineHeight: boolean;
}

// Matches the frame's default state: Screen Reader selected, everything else off.
const defaultSettings: LegibilitySettings = {
  screenReader: true,
  contrastPlus: false,
  smartContrast: false,
  biggerText: false,
  textSpacing: false,
  lineHeight: false,
};

interface LegibilityState extends LegibilitySettings {
  toggle: (key: keyof LegibilitySettings) => void;
  reset: () => void;
}

export const useLegibilityStore = create<LegibilityState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      toggle: (key) => set((state) => ({ [key]: !state[key] })),
      reset: () => set({ ...defaultSettings }),
    }),
    {
      name: 'ibrary-legibility-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
