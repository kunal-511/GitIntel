"use client";

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ContributorData } from '@/lib/github';

interface ContributorChartProps {
  data: ContributorData[];
  height?: number;
}

export default function ContributorChart({ data, height = 300 }: ContributorChartProps) {
  // Take top 10 contributors
  const topContributors = data.slice(0, 10);

  const formatTooltip = (value: number, name: string, props: { payload?: { login?: string } }) => {
    return [
      `${value} contributions`,
      props.payload?.login || 'Unknown'
    ];
  };

  const formatXAxis = (tickItem: string) => {
    return tickItem.length > 8 ? `${tickItem.slice(0, 8)}...` : tickItem;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={topContributors}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="login" 
          tickFormatter={formatXAxis}
          stroke="#9CA3AF"
          fontSize={12}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis stroke="#9CA3AF" fontSize={12} />
        <Tooltip
          formatter={formatTooltip}
          contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#F3F4F6'
          }}
        />
        <Bar 
          dataKey="contributions" 
          fill="#8B5CF6"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
} 