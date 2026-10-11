import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Share } from 'react-native';
import Markdown from 'react-native-markdown-display';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme';
import { StateView } from '../components/StateView';
import { useLesson } from '../hooks/useIbraryContent';
import type { Comment } from '../api/types';
import { useFavoritesStore } from '../store/favoritesStore';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Built from Figma frame 661:16725 ("Classes", dark) — the lesson reader,
// shown when a learner taps a lesson under a topic.
//
// Uses the project's real fetch path (useLesson → getLesson → currently
// fixtureLesson, per src/api/client.ts's ENDPOINTS_LIVE.lesson === false)
// rather than a screen-local fixture — this is the first screen in the
// Classes flow where that hook already existed and fit directly, so
// StateView drives its real loading/empty/error states, not a simulated
// one. fixtureLesson (src/api/fixtures.ts) was updated to match this
// frame's "Base Ten System" content — flag: getLesson() returns that same
// fixture for every contentIndex right now, a pre-existing simplification
// this task didn't introduce.
//
// Subtitle gap: Figma's subtitle under the lesson title is the TOPIC name
// ("Number Bases"), but RootStackParamList['LessonReader'] only carries
// `selection` (which has `subject`, not a topic title) and `contentIndex`
// — no topic-title field is threaded through navigation. Using
// `selection.subject` as the subtitle instead; flag if topic title should
// be passed through params.
//
// Not reproduced / stubbed, flagged inline: "Explain It Another Way" and
// ".pdf" buttons (no backing feature/asset), the Video tab (no video
// player library installed), and "Mark as Completed" (local-only toggle,
// not persisted or sent to any API — no such endpoint exists yet).
//
// Audio player (661:16726) + speed picker (661:16727): fully interactive
// UI — expand/collapse, play/pause toggle, speed selection — but no real
// audio engine behind it (no expo-av/expo-audio installed), so play/pause
// and elapsed time don't actually drive playback. Elapsed/duration/
// progress-bar fill are static values matching Figma's own mock numbers.
// Frame 661:16723 ("mark as completed") turned out to be the same base
// reading screen already built here — no separate UI needed for it.

type Props = NativeStackScreenProps<RootStackParamList, 'LessonReader'>;

type Tab = 'explanation' | 'video' | 'comments';

const TABS: { key: Tab; label: string }[] = [
  { key: 'explanation', label: 'Explanation' },
  { key: 'video', label: 'Video' },
  { key: 'comments', label: 'Comments' },
];

export function LessonReaderScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const { selection, contentIndex } = route.params;
  const { status, data: lesson, error, retry } = useLesson(selection, contentIndex);
  const [activeTab, setActiveTab] = useState<Tab>('explanation');
  const favoriteId = `lesson:${selection.className}:${selection.subject}:${selection.themeNumber}:${selection.term}:${contentIndex}`;
  const favorited = useFavoritesStore((s) => s.isFavorited(favoriteId));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const [completed, setCompleted] = useState(false);
  const [localComments, setLocalComments] = useState<Comment[]>([]);
  const [draftComment, setDraftComment] = useState('');
  const [audioPlayerOpen, setAudioPlayerOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [speedPickerOpen, setSpeedPickerOpen] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [sortMode, setSortMode] = useState<'popular' | 'newest'>('newest');
  const [likedCommentIds, setLikedCommentIds] = useState<Set<string>>(new Set());
  const [dislikedCommentIds, setDislikedCommentIds] = useState<Set<string>>(new Set());

  if (status !== 'success' || !lesson) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight, padding: theme.spacing.lg }}>
        <StateView status={status === 'loading' ? 'loading' : status === 'empty' ? 'empty' : 'error'} error={error} onRetry={retry} />
      </View>
    );
  }

  const allComments = [...lesson.comments, ...localComments];

  // Comment has no like/dislike/reply-count fields — this is a local,
  // non-persisted display map keyed by comment id, matching Figma's
  // example numbers for the seeded fixture comments only. New (locally
  // added) comments default to zero via the fallback below.
  const commentMeta: Record<string, { likes: number; dislikes: number; replyCount: number }> = {
    c1: { likes: 111, dislikes: 5, replyCount: 52 },
    c2: { likes: 50, dislikes: 228, replyCount: 52 },
    c3: { likes: 1, dislikes: 5, replyCount: 52 },
  };

  const sortedComments = [...allComments].sort((a, b) => {
    if (sortMode === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    const aLikes = commentMeta[a.id]?.likes ?? 0;
    const bLikes = commentMeta[b.id]?.likes ?? 0;
    return bLikes - aLikes;
  });

  function toggleCommentReaction(id: string, reaction: 'like' | 'dislike') {
    if (reaction === 'like') {
      setLikedCommentIds((s) => toggleSet(s, id));
      setDislikedCommentIds((s) => (s.has(id) ? toggleSet(s, id) : s));
    } else {
      setDislikedCommentIds((s) => toggleSet(s, id));
      setLikedCommentIds((s) => (s.has(id) ? toggleSet(s, id) : s));
    }
  }

  function submitComment() {
    const text = draftComment.trim();
    if (!text) return;
    // Local-only — no CommentSubmission endpoint wired in api/client.ts yet.
    setLocalComments((c) => [...c, { id: `local-${Date.now()}`, author: 'You', text, createdAt: new Date().toISOString() }]);
    setDraftComment('');
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.greyscale.bgLight }}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.xl, paddingBottom: theme.spacing.xl2 }}>
        <View style={{ gap: theme.spacing.md }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: theme.spacing.md,
            }}
          >
            <View style={{ flex: 1, gap: theme.spacing.xs }}>
              <Text
                style={{
                  ...theme.typography.header.xl1.semibold,
                  color: theme.colors.greyscale.textPrimary,
                  textTransform: 'uppercase',
                }}
              >
                {lesson.title}
              </Text>
              <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary }}>
                {selection.subject}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
              <Pressable
                onPress={() =>
                  toggleFavorite({
                    id: favoriteId,
                    kind: 'lesson',
                    title: lesson.title,
                    subtitle: selection.subject,
                    navigate: { screen: 'LessonReader', params: { selection, contentIndex } },
                  })
                }
                accessibilityRole="button"
                accessibilityLabel={favorited ? 'Remove from favorites' : 'Add to favorites'}
                accessibilityState={{ selected: favorited }}
                style={{
                  width: theme.sizes.closeButton,
                  height: theme.sizes.closeButton,
                  borderRadius: theme.radii.lg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: `${theme.colors.accent1.tertiary}33`,
                }}
              >
                <Ionicons name={favorited ? 'heart' : 'heart-outline'} size={20} color={theme.colors.accent1.primary} />
              </Pressable>
              <Pressable
                onPress={() => navigation.navigate('Tabs', { screen: 'Legibility' })}
                accessibilityRole="button"
                accessibilityLabel="Open legibility settings"
                style={{
                  width: theme.sizes.closeButton,
                  height: theme.sizes.closeButton,
                  borderRadius: theme.radii.lg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: `${theme.colors.accent1.tertiary}33`,
                }}
              >
                <Ionicons name="accessibility-outline" size={20} color={theme.colors.accent1.primary} />
              </Pressable>
            </View>
          </View>
          <View style={{ height: 1, backgroundColor: theme.colors.greyscale.stroke }} />
        </View>

        <View
          accessibilityRole="tablist"
          style={{
            flexDirection: 'row',
            backgroundColor: theme.colors.greyscale.white,
            borderRadius: theme.radii.full,
            padding: 2,
          }}
        >
          {TABS.map(({ key, label }) => {
            const selected = activeTab === key;
            return (
              <Pressable
                key={key}
                onPress={() => setActiveTab(key)}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                accessibilityLabel={label}
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: theme.radii.full,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: selected ? theme.colors.accent1.primary : 'transparent',
                }}
              >
                <Text
                  style={{
                    ...theme.typography.body.base.medium,
                    color: selected ? theme.colors.greyscale.white : theme.colors.greyscale.bgLight,
                    fontWeight: selected ? '700' : '500',
                  }}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {activeTab === 'explanation' && (
          <View style={{ gap: theme.spacing.xl }}>
            <Markdown
              style={{
                body: { color: theme.colors.greyscale.textPrimary, fontFamily: 'Manrope', fontSize: 16, lineHeight: 26 },
                heading1: {
                  color: theme.colors.greyscale.textPrimary,
                  fontFamily: 'Campton',
                  fontSize: 24,
                  fontWeight: '600',
                  lineHeight: 36,
                  marginBottom: theme.spacing.md,
                },
                strong: { fontWeight: '700', color: theme.colors.greyscale.textPrimary },
              }}
            >
              {lesson.contentMarkdown}
            </Markdown>

            <View style={{ gap: theme.spacing.md }}>
              <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Explain it another way"
                  style={{
                    flex: 1,
                    height: theme.sizes.ctaButtonHeight,
                    borderRadius: theme.radii.full,
                    borderWidth: 1.2,
                    borderColor: theme.colors.accent1.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...theme.shadows.xs,
                  }}
                >
                  <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.accent1.primary }}>
                    Explain It Another Way
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Download as PDF"
                  style={{
                    width: 100,
                    height: theme.sizes.ctaButtonHeight,
                    borderRadius: theme.radii.full,
                    borderWidth: 1.2,
                    borderColor: theme.colors.accent1.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...theme.shadows.xs,
                  }}
                >
                  <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.accent1.primary }}>
                    ⬇ .pdf
                  </Text>
                </Pressable>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: theme.colors.accent1.primary,
                  borderRadius: theme.radii.full,
                  padding: theme.spacing.sm,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: theme.colors.greyscale.white,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: theme.colors.greyscale.white }}>◀</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 4, flex: 1, marginHorizontal: theme.spacing.sm }}>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <View key={i} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: theme.colors.greyscale.white }} />
                  ))}
                </View>
                <Pressable
                  onPress={() => setCompleted((v) => !v)}
                  accessibilityRole="button"
                  accessibilityLabel={completed ? 'Marked as completed' : 'Mark as completed'}
                  accessibilityState={{ selected: completed }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: theme.spacing.xs,
                    backgroundColor: theme.colors.greyscale.white,
                    borderRadius: theme.radii.full,
                    paddingHorizontal: theme.spacing.md,
                    paddingVertical: theme.spacing.sm,
                  }}
                >
                  <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.accent1.primary, fontWeight: '600' }}>
                    {completed ? 'Completed' : 'Mark as Completed'}
                  </Text>
                  {completed && <Ionicons name="checkmark" size={16} color={theme.colors.accent1.primary} />}
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'video' && (
          <View style={{ gap: theme.spacing.lg }}>
            {lesson.videoUrl ? (
              <>
                {/* No video player library installed (e.g. expo-av /
                    expo-video) — themed placeholder stands in for the real
                    player, but the surrounding chrome (transport controls,
                    progress) mirrors the audio player for consistency,
                    using the same mock elapsed/duration values. */}
                <View
                  style={{
                    height: 220,
                    borderRadius: theme.radii.xl,
                    backgroundColor: theme.colors.greyscale.bgDarken,
                    overflow: 'hidden',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Expand video"
                    style={{
                      position: 'absolute',
                      top: theme.spacing.sm,
                      right: theme.spacing.sm,
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: theme.colors.accent1.primary,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="expand-outline" size={18} color={theme.colors.greyscale.white} />
                  </Pressable>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingBottom: theme.spacing.sm }}>
                    <Pressable accessibilityRole="button" accessibilityLabel="Skip to start">
                      <Ionicons name="play-skip-back" size={20} color={theme.colors.greyscale.textPrimary} />
                    </Pressable>
                    <Pressable accessibilityRole="button" accessibilityLabel="Back 10 seconds">
                      <MaterialIcons name="replay-10" size={22} color={theme.colors.greyscale.textPrimary} />
                    </Pressable>
                    <Pressable
                      onPress={() => setVideoPlaying((v) => !v)}
                      accessibilityRole="button"
                      accessibilityLabel={videoPlaying ? 'Pause video' : 'Play video'}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        backgroundColor: theme.colors.accent1.primary,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons name={videoPlaying ? 'pause' : 'play'} size={20} color={theme.colors.greyscale.white} />
                    </Pressable>
                    <Pressable accessibilityRole="button" accessibilityLabel="Forward 10 seconds">
                      <MaterialIcons name="forward-10" size={22} color={theme.colors.greyscale.textPrimary} />
                    </Pressable>
                    <Pressable accessibilityRole="button" accessibilityLabel="Skip to end">
                      <Ionicons name="play-skip-forward" size={20} color={theme.colors.greyscale.textPrimary} />
                    </Pressable>
                  </View>
                  <View style={{ paddingHorizontal: theme.spacing.md, paddingBottom: theme.spacing.sm, gap: 2 }}>
                    <View style={{ height: 6, borderRadius: 3, backgroundColor: `${theme.colors.greyscale.textSecondary}66`, overflow: 'hidden' }}>
                      <View style={{ width: '49%', height: '100%', backgroundColor: theme.colors.greyscale.white }} />
                    </View>
                    <Text style={{ alignSelf: 'flex-end', color: theme.colors.greyscale.white, fontSize: 12, fontWeight: '700' }}>
                      47:38 / 1:52:32
                    </Text>
                  </View>
                </View>

                {/* Views/rating — no backing field on Lesson; static mock
                    counts matching Figma's example numbers. */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
                    <Ionicons name="eye-outline" size={16} color={theme.colors.greyscale.textSecondary} />
                    <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary }}>
                      15,202,211 Total Views
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
                    <Ionicons name="star" size={14} color={theme.colors.accent1.tertiary} />
                    <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary }}>
                      4.6 (1,345 Review)
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
                  <Pressable
                    onPress={() => {
                      setLiked((v) => !v);
                      if (disliked) setDisliked(false);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={liked ? 'Remove like' : 'Like this video'}
                    accessibilityState={{ selected: liked }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: theme.spacing.xs,
                      borderWidth: 1,
                      borderColor: liked ? theme.colors.accent1.primary : theme.colors.greyscale.stroke,
                      borderRadius: theme.radii.full,
                      paddingHorizontal: theme.spacing.md,
                      paddingVertical: theme.spacing.sm,
                    }}
                  >
                    <Ionicons
                      name={liked ? 'thumbs-up' : 'thumbs-up-outline'}
                      size={16}
                      color={liked ? theme.colors.accent1.primary : theme.colors.greyscale.textSecondary}
                    />
                    <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary }}>22K</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setDisliked((v) => !v);
                      if (liked) setLiked(false);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={disliked ? 'Remove dislike' : 'Dislike this video'}
                    accessibilityState={{ selected: disliked }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: theme.spacing.xs,
                      borderWidth: 1,
                      borderColor: disliked ? theme.colors.accent1.primary : theme.colors.greyscale.stroke,
                      borderRadius: theme.radii.full,
                      paddingHorizontal: theme.spacing.md,
                      paddingVertical: theme.spacing.sm,
                    }}
                  >
                    <Ionicons
                      name={disliked ? 'thumbs-down' : 'thumbs-down-outline'}
                      size={16}
                      color={disliked ? theme.colors.accent1.primary : theme.colors.greyscale.textSecondary}
                    />
                    <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary }}>1.1K</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => Share.share({ message: lesson.title })}
                    accessibilityRole="button"
                    accessibilityLabel="Share this video"
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: theme.spacing.xs,
                      borderWidth: 1,
                      borderColor: theme.colors.greyscale.stroke,
                      borderRadius: theme.radii.full,
                      paddingHorizontal: theme.spacing.md,
                      paddingVertical: theme.spacing.sm,
                    }}
                  >
                    <Ionicons name="share-outline" size={16} color={theme.colors.greyscale.textSecondary} />
                    <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textSecondary }}>Share</Text>
                  </Pressable>
                </View>

                <View>
                  <Text
                    numberOfLines={descriptionExpanded ? undefined : 3}
                    style={{ ...theme.typography.body.base.regular, color: theme.colors.greyscale.textPrimary }}
                  >
                    {plainTextFromMarkdown(lesson.contentMarkdown)}
                  </Text>
                  <Pressable
                    onPress={() => setDescriptionExpanded((v) => !v)}
                    accessibilityRole="button"
                    accessibilityLabel={descriptionExpanded ? 'Show less' : 'See more'}
                  >
                    <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textPrimary, textAlign: 'right', marginTop: theme.spacing.xs }}>
                      {descriptionExpanded ? 'See Less' : 'See More'}
                    </Text>
                  </Pressable>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: theme.colors.accent1.primary,
                    borderRadius: theme.radii.full,
                    padding: theme.spacing.sm,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: theme.colors.greyscale.white,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="chevron-back" size={18} color={theme.colors.greyscale.white} />
                  </View>
                  <View style={{ flexDirection: 'row', gap: 4, flex: 1, marginHorizontal: theme.spacing.sm }}>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <View key={i} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: theme.colors.greyscale.white }} />
                    ))}
                  </View>
                  <Pressable
                    // "Next" content isn't tracked on Lesson yet — reuses the
                    // same selection/contentIndex as a placeholder target.
                    onPress={() => navigation.navigate('Quiz', { selection, contentIndex })}
                    accessibilityRole="button"
                    accessibilityLabel="Next: Quiz"
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: theme.spacing.xs,
                      backgroundColor: theme.colors.greyscale.white,
                      borderRadius: theme.radii.full,
                      paddingHorizontal: theme.spacing.md,
                      paddingVertical: theme.spacing.sm,
                    }}
                  >
                    <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.accent1.primary, fontWeight: '600' }}>
                      Next: Quiz
                    </Text>
                    <Ionicons name="arrow-forward" size={14} color={theme.colors.accent1.primary} />
                  </Pressable>
                </View>
              </>
            ) : (
              <StateView status="empty" />
            )}
          </View>
        )}

        {activeTab === 'comments' && (
          <View style={{ gap: theme.spacing.lg }}>
            <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.greyscale.textPrimary }}>
              {/* Figma shows a mock "2.4K" total — using the real count
                  instead, since that number is genuinely computable. */}
              Comments ({allComments.length})
            </Text>

            <View style={{ flexDirection: 'row', backgroundColor: theme.colors.greyscale.bgDarken, borderRadius: theme.radii.full, padding: 4, alignSelf: 'flex-start' }}>
              {(['popular', 'newest'] as const).map((mode) => {
                const selected = sortMode === mode;
                return (
                  <Pressable
                    key={mode}
                    onPress={() => setSortMode(mode)}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    accessibilityLabel={mode === 'popular' ? 'Sort by popular' : 'Sort by newest'}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: theme.spacing.xs,
                      paddingHorizontal: theme.spacing.md,
                      paddingVertical: theme.spacing.sm,
                      borderRadius: theme.radii.full,
                      backgroundColor: selected ? theme.colors.greyscale.bgLight : 'transparent',
                    }}
                  >
                    <Ionicons
                      name={mode === 'popular' ? 'trending-up-outline' : 'calendar-outline'}
                      size={14}
                      color={selected ? theme.colors.greyscale.textPrimary : theme.colors.greyscale.textSecondary}
                    />
                    <Text style={{ color: selected ? theme.colors.greyscale.textPrimary : theme.colors.greyscale.textSecondary, fontWeight: selected ? '700' : '500' }}>
                      {mode === 'popular' ? 'Popular' : 'Newest'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={{ flexDirection: 'row', gap: theme.spacing.md, alignItems: 'flex-start' }}>
              <Avatar theme={theme} name="You" />
              <View
                style={{
                  flex: 1,
                  backgroundColor: theme.colors.greyscale.bgDarken,
                  borderWidth: 1,
                  borderColor: theme.colors.greyscale.stroke,
                  borderRadius: theme.radii.xl,
                  padding: theme.spacing.md,
                  gap: theme.spacing.md,
                }}
              >
                <TextInput
                  value={draftComment}
                  onChangeText={setDraftComment}
                  placeholder="Write your comments here…"
                  placeholderTextColor={theme.colors.greyscale.textSecondary}
                  accessibilityLabel="Write a comment"
                  multiline
                  style={{ color: theme.colors.greyscale.textPrimary, minHeight: 24 }}
                />
                <Pressable
                  onPress={submitComment}
                  accessibilityRole="button"
                  accessibilityLabel="Post comment"
                  style={{
                    alignSelf: 'flex-end',
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: theme.colors.accent1.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="send" size={18} color={theme.colors.greyscale.white} />
                </Pressable>
              </View>
            </View>

            {allComments.length === 0 ? (
              <StateView status="empty" />
            ) : (
              <View accessibilityRole="list" accessibilityLabel="Comments" style={{ gap: theme.spacing.lg }}>
                {sortedComments.map((comment) => {
                  const meta = commentMeta[comment.id] ?? { likes: 0, dislikes: 0, replyCount: 0 };
                  const isLiked = likedCommentIds.has(comment.id);
                  const isDisliked = dislikedCommentIds.has(comment.id);
                  return (
                    <View key={comment.id} style={{ flexDirection: 'row', gap: theme.spacing.md, alignItems: 'flex-start' }}>
                      <Avatar theme={theme} name={comment.author} />
                      <View style={{ flex: 1, gap: theme.spacing.sm }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
                          <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textPrimary, fontWeight: '700' }}>
                            {comment.author}
                          </Text>
                          <Text style={{ ...theme.typography.body.xs.regular, color: theme.colors.greyscale.textSecondary }}>
                            {formatDate(comment.createdAt)}
                          </Text>
                        </View>
                        <Text style={{ ...theme.typography.body.base.regular, color: theme.colors.greyscale.textSecondary }}>
                          {comment.text}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.lg }}>
                          <Pressable
                            onPress={() => toggleCommentReaction(comment.id, 'like')}
                            accessibilityRole="button"
                            accessibilityLabel={isLiked ? 'Remove like' : 'Like this comment'}
                            accessibilityState={{ selected: isLiked }}
                            style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}
                          >
                            <Ionicons
                              name={isLiked ? 'thumbs-up' : 'thumbs-up-outline'}
                              size={16}
                              color={isLiked ? theme.colors.accent1.primary : theme.colors.greyscale.textSecondary}
                            />
                            <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textPrimary }}>
                              {meta.likes + (isLiked ? 1 : 0)}
                            </Text>
                          </Pressable>
                          <Pressable
                            onPress={() => toggleCommentReaction(comment.id, 'dislike')}
                            accessibilityRole="button"
                            accessibilityLabel={isDisliked ? 'Remove dislike' : 'Dislike this comment'}
                            accessibilityState={{ selected: isDisliked }}
                            style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}
                          >
                            <Ionicons
                              name={isDisliked ? 'thumbs-down' : 'thumbs-down-outline'}
                              size={16}
                              color={isDisliked ? theme.colors.accent1.primary : theme.colors.greyscale.textSecondary}
                            />
                            <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textPrimary }}>
                              {meta.dislikes + (isDisliked ? 1 : 0)}
                            </Text>
                          </Pressable>
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Reply"
                            style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}
                          >
                            <Ionicons name="chatbubble-outline" size={14} color={theme.colors.greyscale.textPrimary} />
                            <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textPrimary, fontWeight: '700' }}>
                              Reply
                            </Text>
                          </Pressable>
                        </View>
                        {meta.replyCount > 0 && (
                          // No reply/thread data model exists (Comment has
                          // no parent-child structure) — this is a
                          // decorative mock count; tapping does nothing.
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
                            <Ionicons name="chevron-down" size={14} color={theme.colors.accent1.primary} />
                            <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.accent1.primary, fontWeight: '700' }}>
                              See {meta.replyCount} Replies
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {lesson.audioUrl && !audioPlayerOpen && (
        <View
          style={{
            borderTopWidth: 1.5,
            borderTopColor: theme.colors.greyscale.stroke,
            backgroundColor: theme.colors.greyscale.bgLight,
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.md,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ ...theme.typography.header.xl1.semibold, color: theme.colors.greyscale.textPrimary }}>
            Play Audio?
          </Text>
          <Pressable
            onPress={() => setAudioPlayerOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Open audio player"
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: theme.colors.accent1.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="play" size={20} color={theme.colors.greyscale.white} />
          </Pressable>
        </View>
      )}

      {lesson.audioUrl && audioPlayerOpen && (
        <AudioPlayerSheet
          theme={theme}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying((v) => !v)}
          onCollapse={() => setAudioPlayerOpen(false)}
          speed={playbackSpeed}
          onOpenSpeedPicker={() => setSpeedPickerOpen(true)}
        />
      )}

      {speedPickerOpen && (
        <SpeedPicker
          theme={theme}
          current={playbackSpeed}
          onSelect={(speed) => {
            setPlaybackSpeed(speed);
            setSpeedPickerOpen(false);
          }}
          onDismiss={() => setSpeedPickerOpen(false)}
        />
      )}
    </View>
  );
}

function toggleSet(set: Set<string>, id: string): Set<string> {
  const next = new Set(set);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

// Text-initial avatar placeholder — no avatar images/asset pipeline wired
// in yet (Figma uses real profile photos).
function Avatar({ theme, name }: { theme: ReturnType<typeof useTheme>; name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  return (
    <View
      style={{
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.accent2.tertiary,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: theme.colors.accent2.primary, fontWeight: '700' }}>{initial}</Text>
    </View>
  );
}

// Strips basic markdown syntax for the Video tab's plain-text, truncatable
// description — react-native-markdown-display's <Markdown> doesn't support
// numberOfLines truncation, so the Explanation tab's rich rendering isn't
// reused here; this is a simple regex strip, not a full markdown parser.
function plainTextFromMarkdown(markdown: string): string {
  return markdown
    .replace(/^#+\s*/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\n+/g, ' ')
    .trim();
}

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

function formatSpeed(speed: number): string {
  return `${speed}x`;
}

// Built from Figma frame 661:16726 (audio player) / 661:16727 (speed
// picker). No expo-av/expo-audio installed — play/pause is a local toggle
// with no real audio engine behind it, and elapsed/duration/progress are
// static mock values ("47:38 / 1:52:32", ~73% fill) matching Figma's own
// mockup numbers, not derived from a real audio file. Transport icons use
// @expo/vector-icons (Ionicons + MaterialIcons's replay-10/forward-10)
// rather than downloaded Figma assets.
function AudioPlayerSheet({
  theme,
  isPlaying,
  onTogglePlay,
  onCollapse,
  speed,
  onOpenSpeedPicker,
}: {
  theme: ReturnType<typeof useTheme>;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onCollapse: () => void;
  speed: number;
  onOpenSpeedPicker: () => void;
}) {
  return (
    <View
      style={{
        borderTopWidth: 1.5,
        borderTopColor: theme.colors.greyscale.stroke,
        backgroundColor: theme.colors.greyscale.bgDarken,
        padding: theme.spacing.lg,
        gap: theme.spacing.md,
      }}
    >
      <Pressable
        onPress={onCollapse}
        accessibilityRole="button"
        accessibilityLabel="Collapse audio player"
        style={{ alignItems: 'center' }}
      >
        <Ionicons name="chevron-down" size={18} color={theme.colors.greyscale.textSecondary} />
      </Pressable>

      <View
        style={{
          backgroundColor: theme.colors.greyscale.white,
          borderRadius: theme.radii.xl,
          padding: theme.spacing.md,
          gap: theme.spacing.sm,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Ionicons name="volume-medium-outline" size={18} color={theme.colors.greyscale.bgLight} />
          <Pressable onPress={onOpenSpeedPicker} accessibilityRole="button" accessibilityLabel={`Playback speed, ${formatSpeed(speed)}`}>
            <Text style={{ color: theme.colors.greyscale.bgLight, fontWeight: '600' }}>{formatSpeed(speed)}</Text>
          </Pressable>
        </View>

        <View style={{ gap: 2 }}>
          <View style={{ height: 8, borderRadius: 4, backgroundColor: `${theme.colors.greyscale.textSecondary}66`, overflow: 'hidden' }}>
            <View style={{ width: '73%', height: '100%', borderRadius: 4, backgroundColor: theme.colors.greyscale.bgLight }} />
          </View>
          <Text style={{ alignSelf: 'flex-end', color: theme.colors.greyscale.bgLight, fontSize: 12, fontWeight: '700' }}>
            47:38 / 1:52:32
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Skip to start">
          <Ionicons name="play-skip-back" size={22} color={theme.colors.greyscale.textPrimary} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Back 10 seconds">
          <MaterialIcons name="replay-10" size={24} color={theme.colors.greyscale.textPrimary} />
        </Pressable>
        <Pressable
          onPress={onTogglePlay}
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: theme.colors.accent1.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={20} color={theme.colors.greyscale.white} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Forward 10 seconds">
          <MaterialIcons name="forward-10" size={24} color={theme.colors.greyscale.textPrimary} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Skip to end">
          <Ionicons name="play-skip-forward" size={22} color={theme.colors.greyscale.textPrimary} />
        </Pressable>
      </View>
    </View>
  );
}

function SpeedPicker({
  theme,
  current,
  onSelect,
  onDismiss,
}: {
  theme: ReturnType<typeof useTheme>;
  current: number;
  onSelect: (speed: number) => void;
  onDismiss: () => void;
}) {
  return (
    <Pressable
      onPress={onDismiss}
      accessibilityRole="button"
      accessibilityLabel="Dismiss speed picker"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
      }}
    >
      <View
        accessibilityRole="menu"
        style={{
          marginRight: theme.spacing.lg,
          marginBottom: 200,
          borderRadius: theme.radii.lg,
          overflow: 'hidden',
          backgroundColor: theme.colors.greyscale.bgLight,
        }}
      >
        {PLAYBACK_SPEEDS.map((speed) => (
          <Pressable
            key={speed}
            onPress={() => onSelect(speed)}
            accessibilityRole="menuitem"
            accessibilityState={{ selected: speed === current }}
            accessibilityLabel={formatSpeed(speed)}
            style={{ paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.sm, alignItems: 'center' }}
          >
            <Text
              style={{
                ...theme.typography.header.xl2.semibold,
                color: speed === current ? theme.colors.accent1.primary : theme.colors.greyscale.textPrimary,
              }}
            >
              {formatSpeed(speed)}
            </Text>
          </Pressable>
        ))}
      </View>
    </Pressable>
  );
}
