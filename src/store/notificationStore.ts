import { create } from 'zustand';

// Built from Figma 661:16811-16814 ("Notification"). No real push-notification
// backend exists, so this is a fixed mock list (the exact items/copy shown in
// Figma's populated-state frames) with local read/archived state — not
// persisted, not fetched. "View" / "Update App" row CTAs are decorative
// (no destination exists for them yet).

export type NotificationKind = 'comment' | 'feature' | 'simple' | 'group' | 'notice';
export type NotificationFilter = 'all' | 'archive' | 'unread' | 'read';

export interface NotificationItem {
  id: string;
  kind: NotificationKind;
  title?: string;
  boldPrefix?: string;
  body: string;
  quote?: string;
  timeAgo: string;
  ctaLabel?: string;
  read: boolean;
  archived: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    kind: 'comment',
    boldPrefix: 'Bola Ahmed',
    body: ' added a comment on your Post',
    quote: 'Looks perfect, I’m on my way now, just a little holdup!',
    timeAgo: '8h',
    ctaLabel: 'View',
    read: false,
    archived: false,
  },
  {
    id: 'n2',
    kind: 'feature',
    title: 'New Feature Alert!',
    body: 'We’re pleased to introduce our new feature that will be rolling out today.',
    timeAgo: '14h',
    ctaLabel: 'Update App',
    read: false,
    archived: false,
  },
  {
    id: 'n3',
    kind: 'simple',
    body: 'Your IBRARY Challenge Video was approved',
    timeAgo: '14h',
    read: false,
    archived: false,
  },
  {
    id: 'n4',
    kind: 'group',
    boldPrefix: 'Steve and 8 others',
    body: ' added comments on your ride Group Chat.',
    timeAgo: '14h',
    read: false,
    archived: false,
  },
  {
    id: 'n5',
    kind: 'notice',
    title: 'Notice Alert!',
    body: 'We will be undergoing a service maintenance from 5th December to 7th December, please bear with us',
    timeAgo: '1d',
    read: false,
    archived: false,
  },
];

interface NotificationState {
  notifications: NotificationItem[];
  filter: NotificationFilter;
  setFilter: (filter: NotificationFilter) => void;
  markRead: (id: string) => void;
  archive: (id: string) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: INITIAL_NOTIFICATIONS,
  filter: 'all',
  setFilter: (filter) => set({ filter }),
  markRead: (id) =>
    set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
  archive: (id) =>
    set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, archived: true, read: true } : n)) })),
  markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
}));
