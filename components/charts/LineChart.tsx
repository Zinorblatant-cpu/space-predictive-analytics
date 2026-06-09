import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polyline, Line, Text as SvgText, Rect } from 'react-native-svg';
import { Colors } from '../../constants/colors';

interface Props {
  data: number[];
  label: string;
  unit: string;
  color?: string;
  height?: number;
}

export default function LineChart({ data, label, unit, color = Colors.primary, height = 120 }: Props) {
  if (data.length < 2) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.waiting}>Aguardando dados...</Text>
      </View>
    );
  }

  const width = 300;
  const padX = 8;
  const padY = 12;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = padX + (i / (data.length - 1)) * chartW;
    const y = padY + (1 - (v - min) / range) * chartH;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const lastVal = data[data.length - 1];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.currentVal, { color }]}>{lastVal.toFixed(1)}{unit}</Text>
      </View>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <Rect x={0} y={0} width={width} height={height} fill={Colors.surface} rx={8} />
        <Line x1={padX} y1={padY} x2={padX} y2={padY + chartH} stroke={Colors.border} strokeWidth={1} />
        <Line x1={padX} y1={padY + chartH} x2={padX + chartW} y2={padY + chartH} stroke={Colors.border} strokeWidth={1} />
        <SvgText x={padX - 2} y={padY + 4} fill={Colors.textMuted} fontSize={8} textAnchor="end">{max.toFixed(0)}</SvgText>
        <SvgText x={padX - 2} y={padY + chartH} fill={Colors.textMuted} fontSize={8} textAnchor="end">{min.toFixed(0)}</SvgText>
        <Polyline points={points} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  currentVal: {
    fontSize: 16,
    fontWeight: '700',
  },
  waiting: {
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 20,
  },
});
