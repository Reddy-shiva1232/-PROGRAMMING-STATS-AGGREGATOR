import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PlatformStats = ({ stats }) => {
  if (!stats) return null;

  const chartData = [
    {
      name: 'LeetCode',
      problems: stats.leetcode.totalSolved,
      rating: stats.leetcode.weeklyProgress,
    },
    {
      name: 'CodeChef',
      problems: parseInt(stats.codechef.problemsSolved?.match(/\d+/)?.[0] || 0),
      rating: parseInt(stats.codechef.rating?.match(/\d+/)?.[0] || 0),
    },
    {
      name: 'Codeforces',
      problems: parseInt(stats.codeforces.problemsSolved?.match(/\d+/)?.[0] || 0),
      rating: parseInt(stats.codeforces.rating?.match(/\d+/)?.[0] || 0),
    }
  ];

  return (
    <div className="space-y-6">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="problems" fill="#8884d8" name="Problems Solved" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="rating" fill="#82ca9d" name="Rating/Progress" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PlatformStats;