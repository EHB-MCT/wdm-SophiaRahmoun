import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Users({ users, onRefresh }) {
  const [filters, setFilters] = useState({
    ageRange: '',
    emotion: '',
    dateRange: ''
  });
  const [filteredUsers, setFilteredUsers] = useState(users);

  const applyFilters = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.ageRange) queryParams.append('ageRange', filters.ageRange);
      if (filters.emotion) queryParams.append('emotion', filters.emotion);
      if (filters.dateRange) queryParams.append('dateRange', filters.dateRange);

      const response = await fetch(`http://localhost:3000/api/admin/users?${queryParams}`);
      const data = await response.json();
      setFilteredUsers(data);
    } catch (error) {
      console.error('Failed to apply filters:', error);
    }
  };

  const resetFilters = () => {
    setFilters({ ageRange: '', emotion: '', dateRange: '' });
    setFilteredUsers(users);
  };

  return (
    <div className="users-page">
      <div className="page-header">
        <h1>Users</h1>
        <button onClick={onRefresh} className="refresh-btn">Refresh</button>
      </div>

      <div className="filters">
        <h3>Filters</h3>
        <div className="filter-controls">
          <select 
            value={filters.ageRange} 
            onChange={(e) => setFilters({...filters, ageRange: e.target.value})}
          >
            <option value="">All Ages</option>
            <option value="18-25">18-25</option>
            <option value="26-35">26-35</option>
            <option value="36-50">36-50</option>
            <option value="51+">51+</option>
          </select>

          <select 
            value={filters.emotion} 
            onChange={(e) => setFilters({...filters, emotion: e.target.value})}
          >
            <option value="">All Emotions</option>
            <option value="happy">Happy</option>
            <option value="sad">Sad</option>
            <option value="angry">Angry</option>
            <option value="neutral">Neutral</option>
          </select>

          <select 
            value={filters.dateRange} 
            onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
          >
            <option value="">All Time</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>

          <button onClick={applyFilters}>Apply Filters</button>
          <button onClick={resetFilters}>Reset</button>
        </div>
      </div>

      <div className="users-grid">
        {filteredUsers.map((user) => (
          <div key={user.uid} className="user-card">
            <Link to={`/user/${user.uid}`} className="user-link">
              <h3>{user.uid}</h3>
              <p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
              <p>Last Seen: {new Date(user.lastSeen).toLocaleDateString()}</p>
              <p>Selfies: {user.selfieCount}</p>
              {user.lastEmotion && (
                <p>Last Emotion: {user.lastEmotion}</p>
              )}
            </Link>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="no-results">
          <p>No users found matching the criteria.</p>
        </div>
      )}
    </div>
  );
}