import { useState } from 'react';
import StatsCard from './StatsCard';
import PerformanceGraph from './PerformanceGraph';
import PlatformStats from './PlatformStats';
import UserSearch from './UserSearch';
import { CodeBracketIcon, TrophyIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline';
// finally commited
function Dashboard() {
  // This would come from an API in a real implementation
  // const [stats] = useState({
  //   totalSolved: 523,
  //   weeklyProgress: 12,
  //   contestsParticipated: 45,
  //   ranking: 1234
  // });

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");

  const fetchAllStats = async (searchUsername) => {
    setUsername(searchUsername);
    setLoading(true);
    setError("");
    setStats(null);

    try {
      // Fetch LeetCode data
      const leetcodeResponse = await fetch("http://localhost:5000/leetcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query getUserProfile($username: String!) {
              matchedUser(username: $username) {
                submitStatsGlobal {
                  acSubmissionNum {
                    count
                  }
                }
                contestBadge {
                  name
                }
              }
            }
          `,
          variables: { username: searchUsername },
        }),
      });

      // Fetch CodeChef data
      const codechefResponse = await fetch(`http://localhost:5000/codechef/${searchUsername}`);
      
      // Fetch Codeforces data
      const codeforcesResponse = await fetch(`http://localhost:5000/codeforces/${searchUsername}`);

      const [leetcodeData, codechefData, codeforcesData] = await Promise.all([
        leetcodeResponse.json(),
        codechefResponse.json(),
        codeforcesResponse.json()
      ]);

      if (leetcodeData.errors) {
        throw new Error(leetcodeData.errors[0].message);
      }

      const userData = leetcodeData.data.matchedUser;
      if (!userData) {
        throw new Error("User not found on LeetCode!");
      }

      setStats({
        leetcode: {
          totalSolved: userData.submitStatsGlobal.acSubmissionNum[0].count,
          weeklyProgress: userData.submitStatsGlobal.acSubmissionNum[1]?.count || 0,
          contestBadge: userData.contestBadge?.name || "No Badge",
        },
        codechef: {
          rating: codechefData.rating,
          problemsSolved: codechefData.problemsSolved,
          stars: codechefData.stars,
        },
        codeforces: {
          rating: codeforcesData.rating,
          maxRating: codeforcesData.maxRating,
          problemsSolved: codeforcesData.problemsSolved,
        }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-white py-8">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Programming Stats Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">Track your progress across multiple platforms</p>
        </div>

        <UserSearch onSearch={fetchAllStats} />

        {loading && <p className="text-center text-lg text-gray-700">Fetching data...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {stats && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {/* LeetCode Stats */}
              <StatsCard 
                title="LeetCode Problems"
                value={stats.leetcode.totalSolved}
                icon={<CodeBracketIcon className="h-6 w-6" />}
                color="bg-blue-500"
              />
              <StatsCard 
                title="LeetCode Weekly"
                value={stats.leetcode.weeklyProgress}
                icon={<ClockIcon className="h-6 w-6" />}
                color="bg-green-500"
              />
              
              {/* CodeChef Stats */}
              <StatsCard 
                title="CodeChef Rating"
                value={stats.codechef.rating}
                icon={<StarIcon className="h-6 w-6" />}
                color="bg-yellow-500"
              />
              <StatsCard 
                title="CodeChef Problems"
                value={stats.codechef.problemsSolved}
                icon={<CodeBracketIcon className="h-6 w-6" />}
                color="bg-red-500"
              />
              
              {/* Codeforces Stats */}
              <StatsCard 
                title="Codeforces Rating"
                value={stats.codeforces.rating}
                icon={<StarIcon className="h-6 w-6" />}
                color="bg-purple-500"
              />
              <StatsCard 
                title="Codeforces Max Rating"
                value={stats.codeforces.maxRating}
                icon={<TrophyIcon className="h-6 w-6" />}
                color="bg-indigo-500"
              />
              <StatsCard 
                title="Codeforces Problems"
                value={stats.codeforces.problemsSolved}
                icon={<CodeBracketIcon className="h-6 w-6" />}
                color="bg-pink-500"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Performance Trend</h2>
                <PerformanceGraph username={username} />
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Platform Statistics</h2>
                <PlatformStats stats={stats} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;