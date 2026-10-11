import React, { useEffect } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';

// Built from Figma frame 661:16311 ("Loading Quote", dark). The "light
// mode" link sent for this screen (654:22399) resolved to the exact same
// dark-styled content instead of a distinct light design — same pattern as
// the Splash screen (see SplashScreen.tsx): flagging rather than
// fabricating a light variant. This screen appears to have a single fixed
// (dark, photo-backed) look regardless of theme. `theme.launch.bg` is used
// for the base background (the "Sandow Gray" collection used only on this
// screen and Splash), `theme.colors.accent1.primary` for the FAB (a real
// shared token, unlike `theme.launch`).
//
// The bottom gradient behind the quote text is approximated with a plain
// semi-opaque overlay (no gradient library is installed) rather than the
// exact Figma gradient — visually close, not pixel-exact.
//
// FAB arrow uses @expo/vector-icons (Ionicons "arrow-forward") rather than
// a downloaded Figma asset — close enough for a generic forward arrow.
//
// Auto-advances to Onboarding after 5s (tap the FAB/quote to skip ahead
// sooner) — matches the intended Splash -> Loading Quote (5s) ->
// Onboarding launch timing.

type Props = NativeStackScreenProps<RootStackParamList, 'LoadingQuote'>;

const AUTO_ADVANCE_MS = 5000;

export function LoadingQuoteScreen({ navigation }: Props) {
  const theme = useTheme();

  function continuePress() {
    navigation.replace('Onboarding');
  }

  useEffect(() => {
    const timer = setTimeout(continuePress, AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.launch.bg }}>
      <Image
        source={require('../../assets/images/loading-quote-bg.png')}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '55%',
          backgroundColor: theme.launch.bg,
          opacity: 0.55,
        }}
      />

      <Pressable
        onPress={continuePress}
        accessibilityRole="button"
        accessibilityLabel="Continue"
        style={{
          position: 'absolute',
          left: theme.spacing.xl,
          right: theme.spacing.xl,
          bottom: theme.spacing.xl3,
          alignItems: 'center',
          gap: theme.spacing.xl,
        }}
      >
        <View
          style={{
            width: 73,
            height: 73,
            borderRadius: theme.radii.xl + 5,
            backgroundColor: theme.colors.accent1.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="arrow-forward" size={28} color={theme.launch.white} />
        </View>
        <Text
          style={{
            ...theme.typography.header.xl2.semibold,
            color: theme.launch.white,
            textAlign: 'center',
          }}
        >
          Education is the key to the economic, political and social development of any nation
        </Text>
        <Text
          style={{
            ...theme.typography.header.base.semibold,
            color: theme.launch.white,
            textAlign: 'center',
          }}
        >
          — Chief Obafemi Awolowo
        </Text>
      </Pressable>
    </View>
  );
}
