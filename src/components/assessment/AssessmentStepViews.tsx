import React from 'react';
import { View, Text, Pressable, Image, TextInput, ScrollView, PanResponder } from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import type { Theme } from '../../theme';
import type { AssessmentAnswers } from '../../store/assessmentStore';

// Per-step bodies for the 7-screen signup assessment wizard. Built from
// Figma frames 661:16313/654:22429 (gender), 661:16325/654:22418 (class),
// 661:16327/654:22408 (class path), 661:16329/654:22416 (interested
// subjects), 661:16317/16316/16315/16319/16320 + 654:22415/22428/22424/
// 22422/22427 (rate learning level — a 5-position curved drag-slider,
// sampled at all 5 positions to get the exact per-level label/number, not
// guessed), 661:16321/654:22426 (physical limitations), 661:16323/
// 654:22423 (days to commit).
//
// The "Rate Your Learning Level" slider is a real draggable curved arc
// (react-native-svg path + PanResponder), not a trace of Figma's exact
// bezier — the geometry (a quarter-circle arc, radius = box size, center
// at the box's bottom-right corner) is derived to match the visual shape
// and endpoint positions, not extracted from the design file. Tick marks
// are short radial line segments at each of the 5 positions.
//
// Category icons (student cap, teacher, parent, science/art/commercial)
// use @expo/vector-icons rather than the exact Figma icon set (no asset
// pipeline wired in for the real exported SVGs). The physical-limitations
// wheelchair illustration is still a bare emoji — that's a photo-style
// illustration, not a simple icon, so it's flagged separately below
// rather than swapped. The two gender photos ARE the real exported Figma
// assets (raster, so usable directly).

interface StepProps {
  answers: AssessmentAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<AssessmentAnswers>>;
}

function OptionPill({
  label,
  icon,
  selected,
  onPress,
}: {
  label: string;
  icon: (props: { size: number; color: string }) => React.ReactNode;
  selected: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.lg,
        padding: theme.spacing.md,
        borderRadius: theme.radii.full,
        backgroundColor: selected ? theme.colors.accent1.primary : `${theme.colors.accent1.tertiary}33`,
      }}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: theme.radii.lg,
          backgroundColor: selected ? theme.colors.greyscale.white : theme.colors.accent1.primary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon({ size: 26, color: selected ? theme.colors.accent1.primary : theme.colors.greyscale.white })}
      </View>
      <Text
        style={{
          ...theme.typography.body.lg.semibold,
          color: selected ? theme.colors.greyscale.white : theme.colors.greyscale.textPrimary,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// --- Step 1: Gender ---------------------------------------------------

const GENDERS = [
  { key: 'Male', icon: 'male' as const, image: require('../../../assets/images/gender-male.png') },
  { key: 'Female', icon: 'female' as const, image: require('../../../assets/images/gender-female.png') },
] as const;

export function GenderStep({ answers, setAnswers }: StepProps) {
  const theme = useTheme();
  return (
    <View style={{ gap: theme.spacing.md }}>
      {GENDERS.map((g) => {
        const selected = answers.gender === g.key;
        return (
          <Pressable
            key={g.key}
            onPress={() => setAnswers((a) => ({ ...a, gender: g.key }))}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={g.key}
            style={{
              borderRadius: theme.radii.lg * 1.5,
              borderWidth: selected ? 2 : 1,
              borderColor: selected ? theme.colors.accent1.primary : theme.colors.greyscale.stroke,
              backgroundColor: theme.colors.greyscale.bgLight,
              overflow: 'hidden',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', padding: theme.spacing.lg, height: 180 }}>
              <View style={{ flex: 1, gap: theme.spacing.xl2, height: '100%', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
                  <Ionicons name={g.icon} size={22} color={theme.colors.greyscale.textPrimary} />
                  <Text style={{ ...theme.typography.body.lg.semibold, color: theme.colors.greyscale.textPrimary }}>{g.key}</Text>
                </View>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: selected ? 12 : 6,
                    borderWidth: 1.5,
                    borderColor: theme.colors.accent1.primary,
                    backgroundColor: selected ? theme.colors.accent1.primary : 'transparent',
                  }}
                />
              </View>
              <Image source={g.image} style={{ width: 130, height: 160 }} resizeMode="cover" accessibilityIgnoresInvertColors />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

// --- Step 2: Class -----------------------------------------------------

const CLASS_OPTIONS = [
  { key: 'SS1', icon: (p: { size: number; color: string }) => <Ionicons name="school-outline" {...p} /> },
  { key: 'SS2', icon: (p: { size: number; color: string }) => <Ionicons name="school-outline" {...p} /> },
  { key: 'SS3', icon: (p: { size: number; color: string }) => <Ionicons name="school-outline" {...p} /> },
  { key: 'Teacher', icon: (p: { size: number; color: string }) => <MaterialCommunityIcons name="human-male-board" {...p} /> },
  { key: 'Parent/Guardian', icon: (p: { size: number; color: string }) => <Ionicons name="people-outline" {...p} /> },
] as const;

export function ClassStep({ answers, setAnswers }: StepProps) {
  const theme = useTheme();
  return (
    <View style={{ gap: theme.spacing.md }}>
      {CLASS_OPTIONS.map((c) => (
        <OptionPill
          key={c.key}
          label={c.key}
          icon={c.icon}
          selected={answers.className === c.key}
          onPress={() => setAnswers((a) => ({ ...a, className: c.key }))}
        />
      ))}
    </View>
  );
}

// --- Step 3: Class Path --------------------------------------------------

const CLASS_PATH_OPTIONS = [
  { key: 'Science', icon: (p: { size: number; color: string }) => <MaterialCommunityIcons name="flask-outline" {...p} /> },
  { key: 'Art', icon: (p: { size: number; color: string }) => <Ionicons name="color-palette-outline" {...p} /> },
  { key: 'Commercial', icon: (p: { size: number; color: string }) => <Ionicons name="trending-up-outline" {...p} /> },
] as const;

export function ClassPathStep({ answers, setAnswers }: StepProps) {
  const theme = useTheme();
  return (
    <View style={{ gap: theme.spacing.md }}>
      {CLASS_PATH_OPTIONS.map((c) => (
        <OptionPill
          key={c.key}
          label={c.key}
          icon={c.icon}
          selected={answers.classPath === c.key}
          onPress={() => setAnswers((a) => ({ ...a, classPath: c.key }))}
        />
      ))}
    </View>
  );
}

// --- Step 4: Interested Subjects ---------------------------------------

const SCIENCE_SUBJECTS = [
  'English Language',
  'Literature in English',
  'Government',
  'History',
  'Christian Religious Studies (CRS)',
  'Islamic Religious Studies (IRS)',
  'Civic Education',
  'Economics',
  'Visual Arts / Fine Arts',
];

export function InterestedSubjectsStep({ answers, setAnswers }: StepProps) {
  const theme = useTheme();
  const [query, setQuery] = React.useState('');
  const visible = SCIENCE_SUBJECTS.filter((s) => s.toLowerCase().includes(query.trim().toLowerCase()));
  const selectAll = answers.subjects.length === SCIENCE_SUBJECTS.length;

  function toggleSubject(subject: string) {
    setAnswers((a) => ({
      ...a,
      subjects: a.subjects.includes(subject) ? a.subjects.filter((s) => s !== subject) : [...a.subjects, subject],
    }));
  }

  function toggleSelectAll() {
    setAnswers((a) => ({ ...a, subjects: selectAll ? [] : [...SCIENCE_SUBJECTS] }));
  }

  return (
    <View style={{ gap: theme.spacing.lg }}>
      <View
        style={{
          borderRadius: theme.radii.lg,
          borderWidth: 1,
          borderColor: theme.colors.accent1.primary,
          backgroundColor: theme.colors.greyscale.bgDarken,
          padding: theme.spacing.md,
        }}
      >
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search for Subject..."
          placeholderTextColor={theme.colors.greyscale.textSecondary}
          style={{ ...theme.typography.body.base.regular, color: theme.colors.greyscale.textPrimary }}
          accessibilityLabel="Search for subjects"
        />
      </View>

      <Pressable
        onPress={toggleSelectAll}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: selectAll }}
        accessibilityLabel="Select all science subjects"
        style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}
      >
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 1.5,
            borderColor: theme.colors.accent1.primary,
            backgroundColor: selectAll ? theme.colors.accent1.primary : 'transparent',
          }}
        />
        <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.textPrimary }}>
          Select All Science Subject
        </Text>
      </Pressable>

      <ScrollView style={{ maxHeight: 320 }} contentContainerStyle={{ gap: theme.spacing.sm }}>
        {visible.map((subject) => {
          const selected = answers.subjects.includes(subject);
          return (
            <Pressable
              key={subject}
              onPress={() => toggleSubject(subject)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={subject}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: theme.spacing.lg,
                borderRadius: theme.radii.lg,
                borderWidth: selected ? 0 : 1,
                borderColor: theme.colors.greyscale.stroke,
                backgroundColor: selected ? theme.colors.accent1.primary : theme.colors.greyscale.bgDarken,
              }}
            >
              <Text style={{ ...theme.typography.body.lg.semibold, color: selected ? theme.colors.greyscale.white : theme.colors.greyscale.textPrimary }}>
                {subject}
              </Text>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 1.5,
                  borderColor: selected ? theme.colors.greyscale.white : theme.colors.greyscale.textTertiary,
                  backgroundColor: selected ? theme.colors.greyscale.white : 'transparent',
                }}
              />
            </Pressable>
          );
        })}
      </ScrollView>

      {answers.subjects.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, alignItems: 'center' }}>
          <Text style={{ ...theme.typography.body.xs.regular, color: theme.colors.greyscale.textSecondary }}>Selected</Text>
          {answers.subjects.map((s) => (
            <Pressable
              key={s}
              onPress={() => toggleSubject(s)}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${s}`}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.spacing.xs,
                paddingHorizontal: theme.spacing.sm,
                paddingVertical: theme.spacing.xs,
                borderRadius: theme.radii.md,
                backgroundColor: `${theme.colors.accent1.tertiary}33`,
              }}
            >
              <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.accent1.primary }}>{s}</Text>
              <Ionicons name="close" size={14} color={theme.colors.accent1.primary} />
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

// --- Step 5: Rate Learning Level -----------------------------------------

const LEARNING_LEVELS = [
  { value: 1, label: 'Needs Strengthening' },
  { value: 2, label: 'Developing Level' },
  { value: 3, label: 'Average Level' },
  { value: 4, label: 'Proficient Level' },
  { value: 5, label: 'Advanced Level' },
] as const;

// Quarter-circle arc geometry: radius = ARC_SIZE, center at the
// (padded) box's bottom-right corner. Level 1 sits at bottom-left
// (angle 180°), level 5 at top-right (angle 270°), levels 2-4 spaced
// evenly between. PAD gives the 56px rotated thumb room so it doesn't
// clip the box edges.
const ARC_SIZE = 280;
const ARC_PAD = 32;
const ARC_BOX = ARC_SIZE + ARC_PAD * 2;
const ARC_CENTER = ARC_PAD + ARC_SIZE;
const THUMB_SIZE = 56;

// Cubic-bezier tangent constant for a 90° circular arc.
const BEZIER_K = 0.5523;

function angleForLevel(level: number): number {
  return 180 + (level - 1) * 22.5;
}

function pointForLevel(level: number): { x: number; y: number } {
  const rad = (angleForLevel(level) * Math.PI) / 180;
  return {
    x: ARC_CENTER + ARC_SIZE * Math.cos(rad),
    y: ARC_CENTER + ARC_SIZE * Math.sin(rad),
  };
}

function angleToLevel(angleDeg: number): number {
  const clamped = Math.max(180, Math.min(270, angleDeg));
  const raw = 1 + (clamped - 180) / 22.5;
  return Math.min(5, Math.max(1, Math.round(raw)));
}

export function LearningLevelStep({ answers, setAnswers }: StepProps) {
  const theme = useTheme();
  const current = LEARNING_LEVELS.find((l) => l.value === answers.learningLevel) ?? LEARNING_LEVELS[2];

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => updateFromTouch(evt.nativeEvent.locationX, evt.nativeEvent.locationY),
      onPanResponderMove: (evt) => updateFromTouch(evt.nativeEvent.locationX, evt.nativeEvent.locationY),
    }),
  ).current;

  function updateFromTouch(touchX: number, touchY: number) {
    const dx = touchX - ARC_CENTER;
    const dy = touchY - ARC_CENTER;
    const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
    const normalized = angleDeg < 0 ? angleDeg + 360 : angleDeg;
    const level = angleToLevel(normalized);
    setAnswers((a) => (a.learningLevel === level ? a : { ...a, learningLevel: level }));
  }

  function adjust(delta: number) {
    setAnswers((a) => ({ ...a, learningLevel: Math.min(5, Math.max(1, a.learningLevel + delta)) }));
  }

  const pathD = `M ${ARC_PAD} ${ARC_PAD + ARC_SIZE} C ${ARC_PAD} ${ARC_PAD + ARC_SIZE * (1 - BEZIER_K)} ${ARC_PAD + ARC_SIZE * (1 - BEZIER_K)} ${ARC_PAD} ${ARC_PAD + ARC_SIZE} ${ARC_PAD}`;
  const thumb = pointForLevel(current.value);

  return (
    <View style={{ gap: theme.spacing.xl2, alignItems: 'center' }}>
      <View
        {...panResponder.panHandlers}
        accessibilityRole="adjustable"
        accessibilityLabel="Rate your learning level"
        accessibilityValue={{ min: 1, max: 5, now: current.value, text: current.label }}
        onAccessibilityAction={(event) => {
          if (event.nativeEvent.actionName === 'increment') adjust(1);
          else if (event.nativeEvent.actionName === 'decrement') adjust(-1);
        }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        style={{ width: ARC_BOX, height: ARC_BOX }}
      >
        <Svg width={ARC_BOX} height={ARC_BOX} style={{ position: 'absolute' }}>
          <Path d={pathD} stroke={theme.colors.accent1.primary} strokeWidth={4} fill="none" strokeLinecap="round" />
          {LEARNING_LEVELS.map((l) => {
            const angle = angleForLevel(l.value);
            const rad = (angle * Math.PI) / 180;
            const inner = { x: ARC_CENTER + (ARC_SIZE - 9) * Math.cos(rad), y: ARC_CENTER + (ARC_SIZE - 9) * Math.sin(rad) };
            const outer = { x: ARC_CENTER + (ARC_SIZE + 9) * Math.cos(rad), y: ARC_CENTER + (ARC_SIZE + 9) * Math.sin(rad) };
            return (
              <Line
                key={l.value}
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke={theme.colors.greyscale.white}
                strokeWidth={2}
                strokeOpacity={0.6}
              />
            );
          })}
        </Svg>

        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: thumb.x - THUMB_SIZE / 2,
            top: thumb.y - THUMB_SIZE / 2,
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            borderRadius: theme.radii.lg,
            backgroundColor: theme.colors.accent1.primary,
            borderWidth: 4,
            borderColor: theme.colors.greyscale.white,
            transform: [{ rotate: '45deg' }],
            alignItems: 'center',
            justifyContent: 'center',
            ...theme.shadows.lg,
          }}
        >
          <View style={{ transform: [{ rotate: '-45deg' }] }}>
            <Ionicons name="arrow-forward" size={18} color={theme.colors.greyscale.white} />
          </View>
        </View>

        <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
          <Ionicons name="help-circle-outline" size={16} color={theme.colors.greyscale.textSecondary} />
          <Text style={{ ...theme.typography.body.base.medium, color: theme.colors.greyscale.textSecondary }}>Drag to adjust</Text>
        </View>

        <View pointerEvents="none" style={{ position: 'absolute', right: 0, bottom: 0, alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 130, lineHeight: 130, fontWeight: '800', color: theme.colors.greyscale.textPrimary }}>
            {current.value}
          </Text>
          <Text style={{ ...theme.typography.header.lg.bold, color: theme.colors.greyscale.textPrimary }}>{current.label}</Text>
        </View>
      </View>
    </View>
  );
}

// --- Step 6: Physical Limitations ----------------------------------------

const LIMITATION_PRESETS = ['Dyslexia', 'Dyscalculia', 'ADHD', 'Myopia'];
const MAX_LIMITATIONS = 10;

export function PhysicalLimitationsStep({ answers, setAnswers }: StepProps) {
  const theme = useTheme();
  const [customText, setCustomText] = React.useState('');

  function toggle(item: string) {
    setAnswers((a) => {
      if (a.physicalLimitations.includes(item)) {
        return { ...a, physicalLimitations: a.physicalLimitations.filter((x) => x !== item) };
      }
      if (a.physicalLimitations.length >= MAX_LIMITATIONS) return a;
      return { ...a, physicalLimitations: [...a.physicalLimitations, item] };
    });
  }

  function addCustom() {
    const trimmed = customText.trim();
    if (!trimmed || answers.physicalLimitations.includes(trimmed) || answers.physicalLimitations.length >= MAX_LIMITATIONS) return;
    setAnswers((a) => ({ ...a, physicalLimitations: [...a.physicalLimitations, trimmed] }));
    setCustomText('');
  }

  return (
    <View style={{ gap: theme.spacing.xl2, alignItems: 'center' }}>
      {/* Stand-in for Figma's wheelchair photo illustration — a large
          illustration, not a simple icon, so it's flagged for a real
          downloaded asset rather than swapped to a vector icon. */}
      <Text style={{ fontSize: 96 }}>♿</Text>

      <View
        style={{
          width: '100%',
          borderWidth: 1,
          borderColor: theme.colors.accent1.primary,
          borderRadius: theme.radii.xl,
          padding: theme.spacing.lg,
          gap: theme.spacing.md,
        }}
      >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
          {LIMITATION_PRESETS.map((item) => {
            const selected = answers.physicalLimitations.includes(item);
            return (
              <Pressable
                key={item}
                onPress={() => toggle(item)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
                accessibilityLabel={item}
                style={{
                  paddingHorizontal: theme.spacing.md,
                  paddingVertical: theme.spacing.sm,
                  borderRadius: theme.radii.md,
                  backgroundColor: selected ? theme.colors.accent1.primary : `${theme.colors.accent1.tertiary}33`,
                }}
              >
                <Text style={{ ...theme.typography.body.sm.medium, color: selected ? theme.colors.greyscale.white : theme.colors.accent1.primary }}>
                  {item}
                </Text>
              </Pressable>
            );
          })}
          {answers.physicalLimitations
            .filter((x) => !LIMITATION_PRESETS.includes(x))
            .map((item) => (
              <Pressable
                key={item}
                onPress={() => toggle(item)}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${item}`}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: theme.spacing.xs,
                  paddingHorizontal: theme.spacing.md,
                  paddingVertical: theme.spacing.sm,
                  borderRadius: theme.radii.md,
                  backgroundColor: theme.colors.accent1.primary,
                }}
              >
                <Text style={{ ...theme.typography.body.sm.medium, color: theme.colors.greyscale.white }}>{item}</Text>
                <Ionicons name="close" size={14} color={theme.colors.greyscale.white} />
              </Pressable>
            ))}
          <TextInput
            value={customText}
            onChangeText={setCustomText}
            onSubmitEditing={addCustom}
            placeholder="Other (type & press enter)"
            placeholderTextColor={theme.colors.greyscale.textSecondary}
            style={{ ...theme.typography.body.sm.regular, color: theme.colors.greyscale.textPrimary, minWidth: 160 }}
            accessibilityLabel="Other physical limitation"
          />
        </View>
        <Text style={{ ...theme.typography.body.xs.regular, color: theme.colors.greyscale.textSecondary, alignSelf: 'flex-end' }}>
          {answers.physicalLimitations.length}/{MAX_LIMITATIONS}
        </Text>
      </View>
    </View>
  );
}

// --- Step 7: Days to Commit ----------------------------------------------

export function DaysToCommitStep({ answers, setAnswers }: StepProps) {
  const theme = useTheme();
  return (
    <View style={{ gap: theme.spacing.xl2, alignItems: 'center' }}>
      <Text style={{ fontSize: 140, lineHeight: 140, fontWeight: '800', color: theme.colors.greyscale.textPrimary }}>
        {answers.daysPerWeek}x
      </Text>
      <View style={{ flexDirection: 'row', gap: theme.spacing.xs, backgroundColor: `${theme.colors.accent1.tertiary}33`, borderRadius: theme.radii.full, padding: theme.spacing.sm }}>
        {[1, 2, 3, 4, 5, 6, 7].map((day) => {
          const selected = day === answers.daysPerWeek;
          return (
            <Pressable
              key={day}
              onPress={() => setAnswers((a) => ({ ...a, daysPerWeek: day }))}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={`${day} days a week`}
              style={{
                width: 44,
                height: 56,
                borderRadius: theme.radii.md,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: selected ? theme.colors.accent1.primary : 'transparent',
              }}
            >
              <Text style={{ ...theme.typography.header.base.bold, color: selected ? theme.colors.greyscale.white : theme.colors.greyscale.textSecondary }}>
                {day}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={{ ...theme.typography.body.lg.medium, color: theme.colors.greyscale.textPrimary, textAlign: 'center' }}>
        I&rsquo;m committed to learning <Text style={{ fontWeight: '700' }}>{answers.daysPerWeek}x</Text> weekly
      </Text>
    </View>
  );
}
