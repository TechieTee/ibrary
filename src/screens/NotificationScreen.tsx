import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Modal } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { SignUpHeader } from '../components/SignUpHeader';
import { NOTIFICATION_EMPTY_ILLUSTRATION_SVG } from '../assets/notificationEmptyIllustration';
import {
  useNotificationStore,
  type NotificationFilter,
  type NotificationItem,
} from '../store/notificationStore';

// Built from Figma 661:16811 (empty state), 661:16812 (populated list),
// 661:16813 (swipe-to-Read/Archive gesture variant), 661:16814 (filter
// bottom sheet). This project has no swipe-gesture library installed
// (react-native-gesture-handler isn't a dependency), so 661:16813's
// left/right swipe actions (Read in green, Archive in blue) are
// reimplemented as a per-row "..." button that opens a small action menu
// with the same two actions, rather than pulling in a new native
// dependency for one screen — same honesty pattern as other simplified
// interactions in this project (flagged, not hidden).
//
// The filter bottom sheet (661:16814) is real local state (All/Archive/
// Unread/Read) that actually filters the list, not decorative.

type Props = NativeStackScreenProps<RootStackParamList, 'Notification'>;

const FILTER_OPTIONS: { value: NotificationFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'archive', label: 'Archive' },
  { value: 'unread', label: 'Unread' },
  { value: 'read', label: 'Read' },
];

const KIND_ICON = 'notifications-outline' as const;

function NotificationRow({
  item,
  onMenu,
}: {
  item: NotificationItem;
  onMenu: () => void;
}) {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: theme.spacing.md,
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.greyscale.bgDarken,
        opacity: item.read ? 0.7 : 1,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: `${theme.colors.accent1.tertiary}33`,
          borderWidth: 1,
          borderColor: theme.colors.accent1.primary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={KIND_ICON} size={16} color={theme.colors.accent1.primary} />
      </View>

      <View style={{ flex: 1, gap: theme.spacing.xs }}>
        {item.title && (
          <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textPrimary }}>
            {item.title}
          </Text>
        )}
        {item.boldPrefix ? (
          <Text style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textPrimary }}>
            <Text style={theme.typography.body.sm.medium}>{item.boldPrefix}</Text>
            {item.body}
          </Text>
        ) : (
          !item.title && (
            <Text style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textPrimary }}>
              {item.body}
            </Text>
          )
        )}
        {item.title && (
          <Text style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textSecondary }}>
            {item.body}
          </Text>
        )}

        {item.quote && (
          <View style={{ flexDirection: 'row', gap: theme.spacing.sm, marginTop: theme.spacing.xs }}>
            <View style={{ width: 3, backgroundColor: theme.colors.greyscale.stroke, borderRadius: 2 }} />
            <Text style={{ flex: 1, ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textSecondary }}>
              "{item.quote}"
            </Text>
          </View>
        )}

        {item.ctaLabel && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={item.ctaLabel}
            style={{
              alignSelf: 'flex-start',
              marginTop: theme.spacing.xs,
              height: 36,
              paddingHorizontal: theme.spacing.lg,
              borderRadius: theme.radii.full,
              backgroundColor: theme.colors.accent1.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.white }}>
              {item.ctaLabel}
            </Text>
          </Pressable>
        )}
      </View>

      <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
        <Text style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textSecondary, fontSize: 11 }}>
          {item.timeAgo}
        </Text>
        <Pressable onPress={onMenu} accessibilityRole="button" accessibilityLabel="More options">
          <Ionicons name="ellipsis-vertical" size={16} color={theme.colors.greyscale.textSecondary} />
        </Pressable>
      </View>
    </View>
  );
}

export function NotificationScreen({ navigation }: Props) {
  const theme = useTheme();
  const notifications = useNotificationStore((s) => s.notifications);
  const filter = useNotificationStore((s) => s.filter);
  const setFilter = useNotificationStore((s) => s.setFilter);
  const markRead = useNotificationStore((s) => s.markRead);
  const archive = useNotificationStore((s) => s.archive);
  const markAllRead = useNotificationStore((s) => s.markAllRead);

  const [search, setSearch] = useState('');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [menuItemId, setMenuItemId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return notifications
      .filter((n) => {
        if (filter === 'archive') return n.archived;
        if (filter === 'unread') return !n.read && !n.archived;
        if (filter === 'read') return n.read && !n.archived;
        return !n.archived;
      })
      .filter((n) => {
        if (!search.trim()) return true;
        const haystack = `${n.title ?? ''} ${n.boldPrefix ?? ''} ${n.body}`.toLowerCase();
        return haystack.includes(search.trim().toLowerCase());
      });
  }, [notifications, filter, search]);

  const menuItem = notifications.find((n) => n.id === menuItemId) ?? null;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <SignUpHeader title="Notification" onBack={() => navigation.goBack()} />

      <View style={{ paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.lg }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.sm,
            backgroundColor: theme.colors.greyscale.bgDarken,
            borderRadius: theme.radii.md,
            paddingHorizontal: theme.spacing.md,
            height: 48,
          }}
        >
          <Ionicons name="search" size={18} color={theme.colors.greyscale.textSecondary} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search"
            placeholderTextColor={theme.colors.greyscale.textSecondary}
            style={{ flex: 1, color: theme.colors.greyscale.textPrimary, ...theme.typography.body.sm.regular }}
          />
          <Pressable
            onPress={() => setFilterSheetOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Filter notifications"
          >
            <Ionicons name="options-outline" size={20} color={theme.colors.accent1.primary} />
          </Pressable>
        </View>
      </View>

      {filtered.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: theme.spacing.md, padding: theme.spacing.xl }}>
          <SvgXml xml={NOTIFICATION_EMPTY_ILLUSTRATION_SVG} width={180} height={180} />
          <Text style={{ ...theme.typography.header.lg.medium, color: theme.colors.greyscale.textPrimary, textAlign: 'center' }}>
            There's no notifications
          </Text>
          <Text style={{ ...theme.typography.body.base.medium, color: theme.colors.greyscale.textSecondary, textAlign: 'center' }}>
            Your notifications will be appear on this page
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingTop: theme.spacing.lg }}>
          {filtered.map((item, i) => (
            <View key={item.id}>
              <NotificationRow item={item} onMenu={() => setMenuItemId(item.id)} />
              {i < filtered.length - 1 && (
                <View style={{ height: 1, backgroundColor: theme.colors.greyscale.stroke }} />
              )}
            </View>
          ))}
        </ScrollView>
      )}

      {/* Row action menu — replaces 661:16813's swipe-to-Read/Archive gesture. */}
      <Modal visible={!!menuItem} transparent animationType="fade" onRequestClose={() => setMenuItemId(null)}>
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}
          onPress={() => setMenuItemId(null)}
        >
          <View
            style={{
              backgroundColor: theme.colors.greyscale.bgLight,
              borderTopLeftRadius: theme.radii.xl,
              borderTopRightRadius: theme.radii.xl,
              padding: theme.spacing.lg,
              gap: theme.spacing.sm,
            }}
          >
            <Pressable
              onPress={() => {
                if (menuItem) markRead(menuItem.id);
                setMenuItemId(null);
              }}
              accessibilityRole="button"
              accessibilityLabel="Mark as read"
              style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, paddingVertical: theme.spacing.md }}
            >
              <Ionicons name="checkmark-circle-outline" size={22} color="#28A745" />
              <Text style={{ ...theme.typography.body.base.medium, color: theme.colors.greyscale.textPrimary }}>Mark as Read</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                if (menuItem) archive(menuItem.id);
                setMenuItemId(null);
              }}
              accessibilityRole="button"
              accessibilityLabel="Archive"
              style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, paddingVertical: theme.spacing.md }}
            >
              <Ionicons name="archive-outline" size={22} color="#363F72" />
              <Text style={{ ...theme.typography.body.base.medium, color: theme.colors.greyscale.textPrimary }}>Archive</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Filter bottom sheet — Figma 661:16814. */}
      <Modal visible={filterSheetOpen} transparent animationType="fade" onRequestClose={() => setFilterSheetOpen(false)}>
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}
          onPress={() => setFilterSheetOpen(false)}
        >
          <View
            style={{
              backgroundColor: theme.colors.greyscale.bgLight,
              borderTopLeftRadius: theme.radii.xl,
              borderTopRightRadius: theme.radii.xl,
              padding: theme.spacing.lg,
              paddingTop: theme.spacing.sm,
              gap: theme.spacing.xs,
            }}
          >
            <View style={{ alignItems: 'center', paddingBottom: theme.spacing.md }}>
              <View style={{ width: 44, height: 6, borderRadius: 3, backgroundColor: theme.colors.greyscale.stroke }} />
            </View>
            {FILTER_OPTIONS.map((opt) => {
              const selected = filter === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => {
                    setFilter(opt.value);
                    setFilterSheetOpen(false);
                  }}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  accessibilityLabel={opt.label}
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: theme.spacing.md }}
                >
                  <Text style={{ ...theme.typography.header.lg.medium, color: theme.colors.greyscale.textPrimary }}>
                    {opt.label}
                  </Text>
                  {selected && <Ionicons name="checkmark" size={20} color="#28A745" />}
                </Pressable>
              );
            })}
            <Pressable
              onPress={() => {
                markAllRead();
                setFilterSheetOpen(false);
              }}
              accessibilityRole="button"
              accessibilityLabel="Mark all as read"
              style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, paddingTop: theme.spacing.md }}
            >
              <Ionicons name="checkmark-done-outline" size={18} color={theme.colors.accent1.primary} />
              <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.accent1.primary }}>Mark all as read</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
