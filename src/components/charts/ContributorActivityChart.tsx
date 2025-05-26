"use client";

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { ContributorCommitData } from '@/lib/github';

interface ContributorActivityChartProps {
  data: ContributorCommitData[];
  height?: number;
  showAdditions?: boolean;
  showDeletions?: boolean;
}

export default function ContributorActivityChart({ 
  data, 
  height = 300,
  showAdditions = false,
  showDeletions = false
}: ContributorActivityChartProps) {
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

  const CustomTooltip = ({ active, payload, label }: { 
    active?: boolean; 
    payload?: Array<{ color: string; value: number; dataKey: string }>; 
    label?: string 
  }) => {
    if (active && payload && payload.length && label) {
      return (
        <div className="bg-neutral-800 border border-neutral-600 rounded-lg p-3 shadow-lg">
          <p className="text-neutral-200 font-medium mb-2">
            Week of {formatTooltipLabel(label)}
          </p>
          <div className="space-y-1">
            {payload.map((entry: { color: string; value: number; dataKey: string }, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-neutral-300">
                  {entry.value} {entry.dataKey}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  if (showAdditions || showDeletions) {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="commitsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="additionsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="deletionsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
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
            dataKey="commits"
            stroke="#3B82F6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#commitsGradient)"
            name="Commits"
          />
          
          {showAdditions && data.some(d => d.additions > 0) && (
            <Area
              type="monotone"
              dataKey="additions"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={0.6}
              fill="url(#additionsGradient)"
              name="Additions"
            />
          )}
          
          {showDeletions && data.some(d => d.deletions > 0) && (
            <Area
              type="monotone"
              dataKey="deletions"
              stroke="#EF4444"
              strokeWidth={2}
              fillOpacity={0.6}
              fill="url(#deletionsGradient)"
              name="Deletions"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="week" 
          tickFormatter={formatXAxis}
          stroke="#9CA3AF"
          fontSize={12}
        />
        <YAxis stroke="#9CA3AF" fontSize={12} />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="commits"
          stroke="#3B82F6"
          strokeWidth={3}
          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
          name="Commits"
        />
      </LineChart>
    </ResponsiveContainer>
  );
} 