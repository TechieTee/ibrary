import { create } from 'zustand';

// Mock leadership-board avatar — no real avatar/loadout backend exists.
// Figma's avatar picker (661:16764 male / 661:16763 female) shows ~50
// distinct animoji illustrations per gender; per direction, this project
// uses exactly one downloaded image per gender (assets/images/avatar-
// male.png, avatar-female.png) looped across every grid cell and every
// leaderboard avatar slot, rather than downloading 50+ individual assets.
// Only `avatarGender` is meaningfully different between any two
// selections (every cell within a gender looks identical), so that's the
// only thing persisted — AvatarPickerScreen's grid-cell "selection"
// highlight is local, cosmetic state, not saved.

export type AvatarGender = 'male' | 'female';

interface LeadershipState {
  avatarGender: AvatarGender;
  setAvatarGender: (gender: AvatarGender) => void;
}

export const useLeadershipStore = create<LeadershipState>((set) => ({
  avatarGender: 'male',
  setAvatarGender: (avatarGender) => set({ avatarGender }),
}));
