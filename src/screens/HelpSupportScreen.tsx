import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { SignUpHeader } from '../components/SignUpHeader';
import { HELP_SUPPORT_ILLUSTRATION_SVG } from '../assets/helpSupportIllustration';

// Built from Figma 661:16752 ("Help & Support") — reached from Profile's
// "Help & Support" row (previously inert). Real exported assets throughout:
// the hero illustration is the actual Figma SVG rendered via react-native-svg's
// SvgXml (see src/assets/helpSupportIllustration.ts), and every contact-method
// icon below is a real icon-font glyph (brand logos where available), not an
// emoji stand-in. "Live Chat" is the only card with a real destination
// (LiveChatScreen); Gmail/Telegram/X/WhatsApp/Instagram have no real
// mailto:/deep-link wiring since there's nothing on the other end to test
// against — tapping them is a no-op, same honesty pattern used for Promo &
// Referrals' social icons.

type Props = NativeStackScreenProps<RootStackParamList, 'HelpSupport'>;

interface ContactCard {
  key: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  onPress?: () => void;
}

export function HelpSupportScreen({ navigation }: Props) {
  const theme = useTheme();

  const cards: ContactCard[] = [
    {
      key: 'gmail',
      icon: <Ionicons name="mail" size={22} color="#EA4335" />,
      label: 'Gmail',
      value: 'support@iBraryLearning.info',
    },
    {
      key: 'live-chat',
      icon: <Ionicons name="chatbubbles" size={22} color={theme.colors.accent1.primary} />,
      label: 'Live Chat',
      value: 'Click here!',
      onPress: () => navigation.navigate('LiveChat'),
    },
    {
      key: 'telegram',
      icon: <Ionicons name="paper-plane" size={22} color="#229ED9" />,
      label: 'Telegram',
      value: '@iBraryLearning',
    },
    {
      key: 'x',
      icon: <Ionicons name="logo-twitter" size={22} color="#1DA1F2" />,
      label: 'X',
      value: '@iBraryLearning',
    },
    {
      key: 'whatsapp',
      icon: <Ionicons name="logo-whatsapp" size={22} color="#25D366" />,
      label: 'Whatsapp',
      value: '+234 816 574 8911',
    },
    {
      key: 'instagram',
      icon: <Ionicons name="logo-instagram" size={22} color="#E1306C" />,
      label: 'Instagram',
      value: '@iBraryLearning',
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <SignUpHeader title="Help & Support" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.xl2, alignItems: 'center' }}>
        <View style={{ alignItems: 'center', gap: theme.spacing.sm }}>
          <SvgXml xml={HELP_SUPPORT_ILLUSTRATION_SVG} width={180} height={120} />
          <Text style={{ ...theme.typography.display.xl2.semibold, color: theme.colors.greyscale.textPrimary, textAlign: 'center' }}>
            How can we assist you?
          </Text>
          <Text style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textSecondary, textAlign: 'center' }}>
            We at iBrary are dedicated to giving you the best experience imaginable. We are available to assist you if you have any questions, worries, or problems.
          </Text>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md, width: '100%' }}>
          {cards.map((card) => (
            <Pressable
              key={card.key}
              onPress={card.onPress}
              accessibilityRole={card.onPress ? 'button' : undefined}
              accessibilityLabel={card.label}
              style={{
                width: '47%',
                height: 110,
                borderRadius: theme.radii.lg,
                borderWidth: 1,
                borderColor: theme.colors.greyscale.stroke,
                backgroundColor: theme.colors.greyscale.bgDarken,
                alignItems: 'center',
                justifyContent: 'center',
                gap: theme.spacing.xs,
                opacity: card.onPress ? 1 : 0.85,
              }}
            >
              {card.icon}
              <Text style={{ ...theme.typography.display.base.medium, color: theme.colors.greyscale.textSecondary }}>
                {card.label}
              </Text>
              <Text style={{ ...theme.typography.display.sm.semibold, color: theme.colors.greyscale.textPrimary }}>
                {card.value}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
