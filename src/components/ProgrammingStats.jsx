import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProgrammingStats = ({ username }) => {
  const [stats, setStats] = useState({
    leetcode: null,
    codechef: null,
    codeforces: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch LeetCode data
        const leetcodeResponse = await fetch('http://localhost:5000/leetcode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
              query getUserProfile($username: String!) {
                matchedUser(username: $username) {
                  username
                  submitStats {
                    acSubmissionNum {
                      difficulty
                      count
                    }
                  }
                }
              }
            `,
            variables: { username }
          })
        });
        const leetcodeData = await leetcodeResponse.json();

        // Fetch CodeChef data
        const codechefResponse = await fetch(`http://localhost:5000/codechef/${username}`);
        const codechefData = await codechefResponse.json();

        // Fetch Codeforces data
        const codeforcesResponse = await fetch(`http://localhost:5000/codeforces/${username}`);
        const codeforcesData = await codeforcesResponse.json();

        setStats({
          leetcode: leetcodeData,
          codechef: codechefData,
          codeforces: codeforcesData,
          loading: false
        });
      } catch (error) {
        setStats(prev => ({ ...prev, error: error.message, loading: false }));
      }
    };

    fetchStats();
  }, [username]);

  if (stats.loading) return <div>Loading...</div>;
  if (stats.error) return <div>Error: {stats.error}</div>;

  const chartData = [
    {
      name: 'LeetCode',
      problems: stats.leetcode?.data?.matchedUser?.submitStats?.acSubmissionNum?.[0]?.count || 0,
      rating: stats.leetcode?.data?.matchedUser?.rating || 0
    },
    {
      name: 'CodeChef',
      problems: parseInt(stats.codechef?.problemsSolved?.match(/\d+/)?.[0] || 0),
      rating: parseInt(stats.codechef?.rating?.match(/\d+/)?.[0] || 0)
    },
    {
      name: 'Codeforces',
      problems: parseInt(stats.codeforces?.problemsSolved?.match(/\d+/)?.[0] || 0),
      rating: parseInt(stats.codeforces?.rating?.match(/\d+/)?.[0] || 0)
    }
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Programming Stats</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Problems Solved</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="problems" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Ratings</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="rating" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProgrammingStats; 