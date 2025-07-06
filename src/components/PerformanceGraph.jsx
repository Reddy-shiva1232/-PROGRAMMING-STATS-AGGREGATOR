import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function PerformanceGraph({ username }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      if (!username) return;

      try {
        const response = await fetch('http://localhost:5000/leetcode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: 'query getUserProfile($username: String!) { matchedUser(username: $username) { submitStatsGlobal { acSubmissionNum { difficulty count submissions } } userCalendar { submissionCalendar } } }',
            variables: { username }
          })
        });

        const result = await response.json();
        
        if (result.errors || !result.data?.matchedUser) {
          throw new Error('Failed to fetch LeetCode data');
        }

        // Create default data for last 6 months
        const defaultData = [];
        for (let i = 5; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          defaultData.push({
            date: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            leetcode: 0,
            codechef: 0,
            codeforces: 0
          });
        }

        // Process submission calendar if available
        if (result.data.matchedUser.userCalendar?.submissionCalendar) {
          try {
            const calendar = JSON.parse(result.data.matchedUser.userCalendar.submissionCalendar);
            const submissions = Object.entries(calendar).map(([timestamp, count]) => ({
              date: new Date(parseInt(timestamp) * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
              leetcode: parseInt(count),
              codechef: 0,
              codeforces: 0
            }));

            // Merge with default data
            const mergedData = defaultData.map(month => {
              const submission = submissions.find(s => s.date === month.date);
              return submission || month;
            });

            setData(mergedData);
          } catch (e) {
            console.error('Error parsing calendar:', e);
            setData(defaultData);
          }
        } else {
          setData(defaultData);
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [username]);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  if (!data.length) return <div className="text-center py-4">No data</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="leetcode" stroke="#8884d8" name="LeetCode" />
        <Line type="monotone" dataKey="codechef" stroke="#82ca9d" name="CodeChef" />
        <Line type="monotone" dataKey="codeforces" stroke="#ffc658" name="Codeforces" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default PerformanceGraph;