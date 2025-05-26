"use client";

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { HistoricalData } from '@/lib/github';

interface GrowthChartProps {
  data: HistoricalData[];
  height?: number;
}

export default function GrowthChart({ data, height = 300 }: GrowthChartProps) {
  const formatXAxis = (tickItem: string) => {
    return format(new Date(tickItem + '-01'), 'MMM yy');
  };

  const formatTooltipLabel = (label: string) => {
    return format(new Date(label + '-01'), 'MMMM yyyy');
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="date" 
          tickFormatter={formatXAxis}
          stroke="#9CA3AF"
          fontSize={12}
        />
        <YAxis stroke="#9CA3AF" fontSize={12} />
        <Tooltip
          labelFormatter={formatTooltipLabel}
          contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#F3F4F6'
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="stars"
          stroke="#FBBF24"
          strokeWidth={2}
          dot={{ fill: '#FBBF24', strokeWidth: 2, r: 4 }}
          name="Stars"
        />
        <Line
          type="monotone"
          dataKey="forks"
          stroke="#10B981"
          strokeWidth={2}
          dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
          name="Forks"
        />
        <Line
          type="monotone"
          dataKey="commits"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
          name="Commits"
        />
      </LineChart>
    </ResponsiveContainer>
  );
} 