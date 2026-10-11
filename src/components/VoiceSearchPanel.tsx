import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';

// Built from Figma frames 753:45966 ("Tap to Interrupt" — assistant
// speaking) and 753:45967 ("Start speaking" — listening), which replace
// the search bar / voice / filter row on Home when voice search is
// active (753:45965, the plain Home frame, is the baseline "before"
// state — everything below this row, gamification pills onward, is
// unchanged and stays off-screen below this panel in both cases).
//
// There's no real speech-to-text or text-to-speech wired up — this is a
// UI-only simulation (same pattern as the decorative mic button it
// replaces): tapping the Home mic opens this panel in "listening" mode,
// it auto-advances to "speaking" mode after a few seconds standing in
// for recognized speech + a generated response, and interrupting/closing
// just dismisses the panel back to the normal search row. No
// recognized-text or response content exists to show.
//
// The panel's background is a fixed dark literal (#141414), not pulled
// through useTheme() — like Splash/Loading-Quote/PaystackCheckout
// elsewhere in this app, Figma only shows one (dark) look for this
// panel regardless of the app's light/dark mode.
//
// The two circular controls' exact icon semantics in Figma were
// ambiguous (both states reuse the same glyph asset in differently
// colored circles, with a separate unlabeled static icon alongside) —
// built as a clearly-defined pair instead: a left "mic" indicator button
// and a right "X" cancel/interrupt button, color-swapped per mode to
// match the screenshots. The extra pause button layered on the speaking
// state (753:45966) is reproduced as a mute toggle for the bar
// animation — decorative, since there's no real audio to pause.

export type VoiceSearchMode = 'listening' | 'speaking';

interface Props {
  mode: VoiceSearchMode;
  onInterrupt: () => void;
  onClose: () => void;
}

const PANEL_BG = '#141414';

export function VoiceSearchPanel({ mode, onInterrupt, onClose }: Props) {
  const theme = useTheme();
  const pulse = useRef(new Animated.Value(1)).current;
  const bars = useRef([0, 1, 2, 3].map(() => new Animated.Value(0.3))).current;
  const [muted, setMuted] = React.useState(false);

  useEffect(() => {
    if (mode !== 'listening') return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.18, duration: 650, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 650, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [mode, pulse]);

  useEffect(() => {
    if (mode !== 'speaking' || muted) return;
    const animations = bars.map((bar, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(bar, { toValue: 1, duration: 320 + i * 60, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
          Animated.timing(bar, { toValue: 0.3, duration: 320 + i * 60, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        ]),
      ),
    );
    animations.forEach((a) => a.start());
    return () => animations.forEach((a) => a.stop());
  }, [mode, muted, bars]);

  const content = (
    <View style={{ alignItems: 'center', gap: theme.spacing.xl }}>
      {mode === 'listening' ? (
        <Animated.View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: theme.colors.greyscale.white,
            transform: [{ scale: pulse }],
          }}
        />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, height: 24 }}>
          {bars.map((bar, i) => (
            <Animated.View
              key={i}
              style={{
                width: 6,
                borderRadius: 3,
                backgroundColor: theme.colors.greyscale.white,
                height: bar.interpolate({ inputRange: [0.3, 1], outputRange: [8, 24] }),
              }}
            />
          ))}
        </View>
      )}
      <Text style={{ ...theme.typography.header.lg.bold, color: theme.colors.greyscale.white }}>
        {mode === 'listening' ? 'Start speaking' : 'Tap to Interrupt'}
      </Text>
    </View>
  );

  return (
    <Pressable
      onPress={mode === 'speaking' ? onInterrupt : undefined}
      accessibilityRole={mode === 'speaking' ? 'button' : undefined}
      accessibilityLabel={mode === 'speaking' ? 'Interrupt assistant' : 'Listening for your question'}
      style={{
        height: 206,
        borderRadius: theme.radii.xl,
        backgroundColor: PANEL_BG,
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.xl,
      }}
    >
      {content}

      <View style={{ flexDirection: 'row', gap: theme.spacing.xl2 }}>
        <Pressable
          onPress={() => mode === 'speaking' && setMuted((m) => !m)}
          accessibilityRole="button"
          accessibilityLabel={mode === 'listening' ? 'Microphone active' : muted ? 'Unmute assistant' : 'Mute assistant'}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: mode === 'listening' ? theme.colors.system.error : '#C0C0C0',
          }}
        >
          <Ionicons name={mode === 'speaking' && muted ? 'mic-off' : 'mic'} size={16} color={theme.colors.greyscale.white} />
        </Pressable>
        <Pressable
          onPress={mode === 'speaking' ? onInterrupt : onClose}
          accessibilityRole="button"
          accessibilityLabel={mode === 'speaking' ? 'Stop assistant' : 'Cancel voice search'}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: mode === 'speaking' ? theme.colors.system.error : '#C0C0C0',
          }}
        >
          <Ionicons name="close" size={16} color={theme.colors.greyscale.white} />
        </Pressable>
      </View>
    </Pressable>
  );
}
