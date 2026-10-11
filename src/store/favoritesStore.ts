import { create } from 'zustand';
import type { RootStackParamList } from '../navigation/types';

// Backs the ♥/♡ favorite toggles that already existed (as local,
// non-persisted useState) on LessonReaderScreen and SubjectSelectionScreen's
// topic-detail view, plus the new Profile -> "Favorite/Saved" list screen
// that reads from it. Previously those toggles didn't go anywhere — tapping
// the heart changed its own color and nothing else. No persistence
// middleware (matches subscriptionStore/assessmentStore, not themeStore) —
// resets on app restart like the rest of this app's mocked state.
//
// HomeScreen also has a ♥/♡ button, but it's in the page header and isn't
// tied to any specific topic/lesson/subject — left as-is (not wired here),
// flagged as a separate, purely decorative control.

export type FavoriteKind = 'topic' | 'lesson';

export interface FavoriteItem {
  id: string;
  kind: FavoriteKind;
  title: string;
  subtitle: string;
  navigate:
    | { screen: 'SubjectSelection'; params: RootStackParamList['SubjectSelection'] }
    | { screen: 'LessonReader'; params: RootStackParamList['LessonReader'] };
}

interface FavoritesState {
  items: Record<string, FavoriteItem>;
  isFavorited: (id: string) => boolean;
  toggleFavorite: (item: FavoriteItem) => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  items: {},
  isFavorited: (id) => id in get().items,
  toggleFavorite: (item) =>
    set((state) => {
      const next = { ...state.items };
      if (item.id in next) {
        delete next[item.id];
      } else {
        next[item.id] = item;
      }
      return { items: next };
    }),
}));
