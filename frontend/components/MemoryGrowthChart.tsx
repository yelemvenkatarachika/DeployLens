'use client';

import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

interface MemoryGrowthChartProps {
  growthData: { day: string; count: number }[];
}

export default function MemoryGrowthChart({ growthData }: MemoryGrowthChartProps) {
  const data = growthData && growthData.length > 0
    ? growthData
    : [
        { day: 'Day 1', count: 12 },
        { day: 'Day 2', count: 24 },
        { day: 'Day 3', count: 39 },
        { day: 'Day 4', count: 53 },
        { day: 'Current', count: 63 }
      ];

  return (
    <div className="h-64 w-full pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '0.5rem',
              color: '#f8fafc',
              fontSize: '12px',
              fontFamily: 'monospace'
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#6366f1"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#memoryGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
