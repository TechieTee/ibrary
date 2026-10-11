import { create } from 'zustand';

// Mock subscription status — there's no real payment/account backend
// wired up yet (PricingScreen/PaystackCheckoutScreen are UI-only). This
// store exists purely so Home's premium-gated actions have something to
// check against. 'none' = never subscribed (shows "Unlock with Pro"),
// 'expired' = subscribed before but lapsed (shows "Subscription
// Expired"), 'active' = gated actions proceed normally. Toggle from
// ProfileScreen's dev controls for testing.
//
// `cycle` records which plan ('monthly'/'yearly') is active, added so the
// new SubscriptionScreen and PricingScreen's 'manage' mode can show
// correct current-plan info and distinguish "Cancel Subscription" (your
// active cycle's tab) from "Switch Subscription Here" (the other tab).
// Always null when status isn't 'active'.

export type SubscriptionStatus = 'none' | 'active' | 'expired';
export type SubscriptionCycle = 'monthly' | 'yearly';

interface SubscriptionState {
  status: SubscriptionStatus;
  cycle: SubscriptionCycle | null;
  /** Dev-toggle convenience: picking 'active' with no prior cycle defaults to monthly. */
  setStatus: (status: SubscriptionStatus) => void;
  /** Used by the real subscribe/switch/cancel flows, which always know the exact cycle. */
  setSubscription: (status: SubscriptionStatus, cycle: SubscriptionCycle | null) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  status: 'none',
  cycle: null,
  setStatus: (status) => set({ status, cycle: status === 'active' ? (get().cycle ?? 'monthly') : null }),
  setSubscription: (status, cycle) => set({ status, cycle }),
}));
