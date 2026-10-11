import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';

// Built from Figma frame 533:26975 ("Splash Screen"). The dark-mode link
// sent for this screen (661:16310) resolved back to this same node/content
// instead of a distinct dark design — flagging rather than fabricating one:
// this screen appears to have a single fixed look regardless of theme
// (common for a branded launch screen, which renders before the app's own
// theme system is even available). `theme.launch` (the "Sandow Gray"
// Figma variable collection used only here) is used instead of
// `theme.colors` since this doesn't vary by mode.

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const AUTO_ADVANCE_MS = 1600;

export function SplashScreen({ navigation }: Props) {
  const theme = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('LoadingQuote');
    }, AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View
      accessibilityLabel="iBrary"
      style={{
        flex: 1,
        backgroundColor: theme.launch.bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        source={require('../../assets/images/ibrary-logo.png')}
        style={{ width: 160, height: 160 }}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}
