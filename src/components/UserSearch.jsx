import { useState } from 'react';

function UserSearch({ onSearch }) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // API Endpoint: GET /api/users/{username}/stats
    // This would fetch user stats from Supabase in a real implementation
    onSearch(username);
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username to search"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Search
        </button>
      </form>
    </div>
  );
}

export default UserSearch;