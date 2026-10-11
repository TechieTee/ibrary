// src/navigation/types.ts
import type { NavigatorScreenParams } from '@react-navigation/native';
import { ContentSelection } from '../api/types';

export type TabParamList = {
  // Optional: set when returning from AllSubjectsScreen's "Continue" so
  // HomeScreen can pick up the chosen subject.
  Home: { selectedSubject?: string } | undefined;
  Classes: undefined;
  Legibility: undefined;
  Assessment: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  // Launch flow: Splash -> LoadingQuote -> Onboarding -> SignUpInfo ->
  // CreatePassword -> VerifyEmail -> Tabs. No "seen onboarding before" /
  // "already signed up" persistence yet, so this always plays on cold
  // start — flagged, not wired up. Sign In doesn't exist yet (pending a
  // future Figma drop) — VerifyEmail's "Submit" goes straight to Tabs for
  // now; once Sign In is built this likely needs to route there instead,
  // per the user's stated signup -> sign in -> dashboard flow.
  Splash: undefined;
  LoadingQuote: undefined;
  Onboarding: undefined;
  SignUpInfo: undefined;
  // Built from the light-mode Sign In frame (654:22438) — the "dark mode"
  // link sent for this pair actually resolved to an unrelated screen
  // (Transaction Receipt, light), and the app's shared theme tokens mean
  // one screen already covers both modes correctly regardless.
  // justReset shows the "Congratulations, you can now Login" modal after
  // a completed password reset.
  SignIn: { justReset?: boolean } | undefined;
  // No "enter your email" screen exists in this flow's Figma frames —
  // Forgot Password goes straight to OTP verification with a placeholder
  // email, flagged in SignInScreen.
  ForgotPasswordVerify: { email: string };
  ResetPassword: { email: string };
  CreatePassword: { email: string };
  VerifyEmail: { email: string };
  // 7-step signup survey, reachable after email verification. Also
  // reused (not duplicated) for Personal Information -> "Onboarding
  // Assessment", via mode: 'edit' — see SignUpAssessmentScreen.tsx for
  // how the two modes diverge (CTA labels, Cancel button, where answers
  // come from / go to, and what happens after the last step).
  SignUpAssessment: { mode?: 'signup' | 'edit' } | undefined;
  // Optional justSubscribed/cycle params let PaystackCheckout hand back a
  // "payment succeeded" signal so Pricing can show its success modal on
  // return, matching the Figma overlay-modal-on-Pricing pattern. `mode`
  // ('subscribe', the default, vs 'manage') distinguishes first-time
  // subscribing (CTA always "Get Started Now") from managing an existing
  // subscription from SubscriptionScreen (CTA is "Cancel Subscription" on
  // your active cycle's tab, "Switch Subscription Here" on the other).
  Pricing: { justSubscribed?: boolean; cycle?: 'monthly' | 'yearly'; mode?: 'subscribe' | 'manage' } | undefined;
  // `mode` is forwarded from Pricing so PaystackCheckout can hand it back
  // on success, letting Pricing show "subscribed" vs "switched" copy.
  PaystackCheckout: { amount: number; cycle: 'monthly' | 'yearly'; mode?: 'subscribe' | 'manage' };
  TransactionReceipt: { amount: number; cycle: 'monthly' | 'yearly' };
  // NavigatorScreenParams lets a stack screen navigate into a specific tab,
  // e.g. navigation.navigate('Tabs', { screen: 'Legibility' }).
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  SubjectSelection: {
    className: string;
    term: number;
    // Optional: when both are set, SubjectSelectionScreen opens directly
    // into that subject's topic-detail view (Level B: Week/lesson
    // breakdown) instead of the top-level subject list — e.g. returning
    // from a lesson/quiz to "the topic content screen" you came from.
    initialSubject?: string;
    initialTopicNumber?: number;
  };
  Quiz: { selection: ContentSelection; contentIndex: number };
  LessonReader: { selection: ContentSelection; contentIndex: number };
  // "See All" from Academic Subjects (Home) — full subject grid,
  // single-select, "Continue" returns the choice to Home.
  AllSubjects: { initialSubject?: string };
  // Profile -> "My Personal Information" row. Both this hub (661:16746)
  // and ProfileDetails below (661:16747) share the exact title "My
  // Personal Information" in Figma despite being different screens —
  // flagged, not a duplicate link. This hub's "Account Settings" and
  // "Notification" rows have no Figma screens yet and are inert;
  // "Onboarding Assessment" reuses SignUpAssessment.
  PersonalInformation: undefined;
  // Profile -> Personal Information -> "Your Profile Details" row. Read-only
  // account fields; mock data intentionally matches the identity shown on
  // the Profile screen (Victor Emmanuel) rather than reproducing 661:16747's
  // broken placeholder values (Last Name/Username both literally "Male").
  ProfileDetails: undefined;
  // Personal Information -> "Account Settings" row (661:16748) — hub for
  // Change Password / Deactivate-Delete Account, continuing the Profile ->
  // Personal Information flow. The 6th link sent alongside these
  // (661:16803) resolved to the unrelated Splash Screen — flagged and
  // ignored rather than guessed at.
  AccountSettings: undefined;
  ChangePassword: undefined;
  DeactivateAccount: undefined;
  // Profile -> "Subscriptions" row (661:16762) — current-plan detail view,
  // continuing the Profile flow. Its "Manage Subscription" button opens
  // Pricing in 'manage' mode. The 10th link sent alongside these
  // (661:16804) again resolved to the unrelated Splash Screen — same
  // mismatch pattern as 661:16803 earlier, flagged and ignored.
  Subscription: undefined;
  // Profile -> "Favorite/Saved" row (661:16825) — lists whatever has been
  // favorited via favoritesStore (LessonReaderScreen / SubjectSelection's
  // topic view). 661:16824 ("Classes") resolved to the existing
  // LessonReaderScreen itself, not a separate screen — see
  // FavoriteSavedScreen.tsx.
  FavoriteSaved: undefined;
  // Profile -> "Promotions" row (previously inert). 661:16740 was the
  // duplicate Profile screen (no new info). 661:16766/16765 are the same
  // "Promo & Referrals" screen's Promotion tab in two states — no
  // promotions (empty) vs two example promo banners; 661:16767/16768 are
  // the Daily Usage tab's check-in card before/after tapping "Check In".
  // All four are one screen (tab + local check-in state), not four
  // screens — see PromoReferralsScreen.tsx. 661:16769 ("Invite Friends")
  // is the share bottom-sheet opened from that screen's "Share" button.
  PromoReferrals: undefined;
  // Profile -> "iBrary Leadership Board" row (previously inert). 661:16818
  // was the duplicate Profile screen (no new info). One screen with a
  // STATS/BOARD tab (661:16334 Badge sub-tab, 661:16335 Stats sub-tab,
  // 661:16336 Details sub-tab — see LeadershipBoardScreen.tsx for why
  // Details' content was rebuilt rather than copied, its Figma frame
  // showed unrelated lorem-ipsum text; 661:16337 is the BOARD tab).
  LeadershipBoard: undefined;
  // Stats tab's avatar edit badge -> here. 661:16764 (Male) / 661:16763
  // (Female) show ~50 distinct avatar options per gender; this project
  // uses one downloaded image per gender, looped — see leadershipStore.ts.
  // 661:16734 ("Video Uploaded", mislabeled) is this screen's "Profile
  // Saved" success modal, shown after "Save Avatar".
  AvatarPicker: undefined;
  // Profile -> "Help & Support" row (previously inert). Six contact-method
  // cards (Gmail/Live Chat/Telegram/X/WhatsApp/Instagram) — see
  // HelpSupportScreen.tsx.
  HelpSupport: undefined;
  // Help & Support -> "Live Chat" card (661:16753). Mock static transcript,
  // no real chat backend — see LiveChatScreen.tsx.
  LiveChat: undefined;
  // Profile -> "Legal" row (previously inert). Hub for Privacy Policy /
  // Terms & Conditions, mirroring the AccountSettings hub pattern.
  Legal: undefined;
  PrivacyPolicy: undefined;
  TermsConditions: undefined;
  // Profile -> "About us" row (previously inert). 661:16755's body content
  // was unfilled Figma lorem-ipsum placeholder — see AboutUsScreen.tsx for
  // why real copy was substituted instead of reproduced verbatim.
  AboutUs: undefined;
  // Home's notifications bell (previously decorative) and a standalone
  // "Notification" screen built from 661:16811 (empty state) / 661:16812
  // (populated list) / 661:16813 (swipe-action variant — reimplemented as a
  // tap menu, see NotificationScreen.tsx) / 661:16814 (filter bottom sheet).
  Notification: undefined;
  // Profile -> "Learning To-Dos" row (previously inert). 661:16826 was the
  // duplicate Profile screen (no new info), skipped. Hub screen built from
  // 661:16827; its 3 category rows open LearningTodoDetail with the
  // matching category id — see LearningTodosScreen.tsx / learningTodos.ts.
  LearningTodos: undefined;
  // Per-category slide carousel (661:16828/16831 Get Learning-Ready;
  // 661:16829/16832/16835 Learn the Right Way; 661:16830/16833/16836 Build
  // Good Habits) — see LearningTodoDetailScreen.tsx for why Figma's swipe
  // gesture is reimplemented as tap controls.
  LearningTodoDetail: { category: 'ready' | 'right-way' | 'good-habits' };
};
