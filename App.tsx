import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useThemeStore } from './src/store/themeStore';

// expo-status-bar was installed but never rendered anywhere, so the status
// bar (time/battery/wifi icons) stayed at the OS default regardless of the
// app's theme — invisible-ish on dark screens, same failure mode flagged
// for PricingScreen's near-black "Skip for now" link. Every dark-mode Figma
// frame pulled this session shows white status-bar icons, so this follows
// `useThemeStore`'s mode globally; PaystackCheckoutScreen's own local
// `<StatusBar barStyle="dark-content" />` (RN's StatusBar, not expo's)
// still wins while that screen is focused, since it's deliberately always
// light regardless of app theme.
export default function App() {
  const mode = useThemeStore((s) => s.mode);

  return (
    <SafeAreaProvider>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <RootNavigator />
    </SafeAreaProvider>
  );
}
