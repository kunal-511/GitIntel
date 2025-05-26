"use client";

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { format, parseISO } from 'date-fns';

interface CommitActivityData {
  week: string;
  total: number;
  contributors: number;
}

interface CommitActivityChartProps {
  data: CommitActivityData[];
  height?: number;
  type?: 'area' | 'bar';
}

export default function CommitActivityChart({ 
  data, 
  height = 300, 
  type = 'area' 
}: CommitActivityChartProps) {
  const formatXAxis = (tickItem: string) => {
    try {
      return format(parseISO(tickItem), 'MMM dd');
    } catch {
      return tickItem;
    }
  };

  const formatTooltipLabel = (label: string) => {
    try {
      return format(parseISO(label), 'MMM dd, yyyy');
    } catch {
      return label;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-neutral-800 border border-neutral-600 rounded-lg p-3 shadow-lg">
          <p className="text-neutral-200 font-medium mb-2">
            Week of {formatTooltipLabel(label)}
          </p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-neutral-300">
                {payload[0].value} commits
              </span>
            </div>
            {payload[1] && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-neutral-300">
                  {payload[1].value} contributors
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="week" 
            tickFormatter={formatXAxis}
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis stroke="#9CA3AF" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="total" 
            fill="#3B82F6"
            radius={[2, 2, 0, 0]}
            name="Commits"
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="commitsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="contributorsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="week" 
          tickFormatter={formatXAxis}
          stroke="#9CA3AF"
          fontSize={12}
        />
        <YAxis stroke="#9CA3AF" fontSize={12} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#3B82F6"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#commitsGradient)"
          name="Commits"
        />
        <Area
          type="monotone"
          dataKey="contributors"
          stroke="#10B981"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#contributorsGradient)"
          name="Contributors"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
} 