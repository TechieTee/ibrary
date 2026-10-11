import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../theme';

// Real circular progress ring using react-native-svg's Svg/Circle
// components directly — this works without any Metro/transformer config;
// that's only needed for importing raw .svg files as components, not for
// using the library's own JS components. Shared across screens (e.g. the
// "Continue From Last Lesson" card and "Latest Activity" cards) — extracted
// here rather than duplicated per-screen.
export function CircularProgress({
  percent,
  color,
  trackColor,
  size = 50,
  strokeWidth = 4,
}: {
  percent: number;
  color: string;
  trackColor: string;
  size?: number;
  strokeWidth?: number;
}) {
  const theme = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percent / 100);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <Text style={{ ...theme.typography.header.xs.semibold, color: theme.colors.greyscale.textPrimary }}>
        {percent}%
      </Text>
    </View>
  );
}
