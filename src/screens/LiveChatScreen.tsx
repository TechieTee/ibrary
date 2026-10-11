import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LIVE_CHAT_REP_AVATAR_SVG } from '../assets/liveChatRepAvatar';

// Built from Figma 661:16753 ("Live Chat") — reached from Help & Support's
// "Live Chat" card. No real chat backend/socket exists, so this renders the
// exact mock transcript from Figma (iBrary Rep.'s welcome message + a quoted
// "You" reply) as static content rather than a live conversation; typing and
// sending is a local-only no-op (messages aren't actually sent anywhere),
// flagged here the same way other mock-backend screens are. The rep avatar
// is the real exported Figma SVG (flat-color-icons online-support), not an
// emoji or icon-font stand-in.

type Props = NativeStackScreenProps<RootStackParamList, 'LiveChat'>;

export function LiveChatScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState('');

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.greyscale.stroke,
        }}
      >
        <View style={{ height: insets.top }} />
        <View style={{ height: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: theme.spacing.lg }}>
          <Pressable
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={{ width: 24, height: 24, justifyContent: 'center' }}
          >
            <Ionicons name="chevron-back" size={22} color={theme.colors.greyscale.textPrimary} />
          </Pressable>
          <Text
            style={{
              ...theme.typography.header.lg.semibold,
              color: theme.colors.greyscale.textPrimary,
              position: 'absolute',
              left: 0,
              right: 0,
              textAlign: 'center',
            }}
          >
            Live Chat
          </Text>
        </View>
      </View>

      <View
        style={{
          backgroundColor: theme.colors.greyscale.bgDarken,
          alignItems: 'center',
          paddingVertical: theme.spacing.lg,
          gap: theme.spacing.sm,
        }}
      >
        <SvgXml xml={LIVE_CHAT_REP_AVATAR_SVG} width={48} height={48} />
        <Text style={{ ...theme.typography.header.base.bold, color: theme.colors.greyscale.textPrimary }}>IBrary Rep.</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.lg }}>
        <View style={{ gap: theme.spacing.xs }}>
          <View
            style={{
              backgroundColor: theme.colors.greyscale.bgDarken,
              borderRadius: theme.radii.lg,
              padding: theme.spacing.md,
              maxWidth: '90%',
            }}
          >
            <Text style={{ ...theme.typography.body.base.regular, color: theme.colors.greyscale.textSecondary }}>
              Welcome to our Platform. If you have any questions, please respond to this message. We are available and ready to assist.
            </Text>
          </View>
          <Text style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textTertiary }}>16:46</Text>
        </View>

        <View style={{ gap: theme.spacing.xs, alignSelf: 'flex-end', alignItems: 'flex-end', maxWidth: '92%' }}>
          <View style={{ backgroundColor: theme.colors.greyscale.bgDarken, borderRadius: theme.radii.lg, overflow: 'hidden' }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: 4, backgroundColor: theme.colors.greyscale.textSecondary }} />
              <View style={{ padding: theme.spacing.sm, gap: 2 }}>
                <Text style={{ ...theme.typography.header.xs.semibold, color: theme.colors.greyscale.textSecondary }}>You</Text>
                <Text style={{ ...theme.typography.body.base.regular, color: theme.colors.greyscale.textSecondary }}>
                  How do i get get more points
                </Text>
              </View>
            </View>
            <View style={{ padding: theme.spacing.md, paddingTop: theme.spacing.sm }}>
              <Text style={{ ...theme.typography.body.base.regular, color: theme.colors.greyscale.textPrimary }}>
                We'll get back to you shortly!
              </Text>
            </View>
          </View>
          <Text style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textTertiary }}>16:46</Text>
        </View>
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.sm,
          paddingHorizontal: theme.spacing.lg,
          paddingTop: theme.spacing.md,
          paddingBottom: insets.bottom + theme.spacing.md,
          borderTopWidth: 1,
          borderTopColor: theme.colors.greyscale.stroke,
        }}
      >
        <Ionicons name="add-circle-outline" size={24} color={theme.colors.greyscale.textSecondary} />
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Type a message"
          placeholderTextColor={theme.colors.greyscale.textTertiary}
          style={{
            flex: 1,
            height: 40,
            borderRadius: theme.radii.md,
            backgroundColor: theme.colors.greyscale.bgDarken,
            paddingHorizontal: theme.spacing.md,
            color: theme.colors.greyscale.textPrimary,
          }}
        />
        <Pressable
          onPress={() => setDraft('')}
          accessibilityRole="button"
          accessibilityLabel="Send message"
        >
          <Ionicons name="send" size={20} color={theme.colors.accent1.primary} />
        </Pressable>
      </View>
    </View>
  );
}
