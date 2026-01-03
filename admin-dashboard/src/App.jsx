import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import Users from './pages/Users';
import Analytics from './pages/Analytics';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchAnalytics();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <h1>Admin Dashboard</h1>
          <div className="nav-links">
            <Link to="/">Users</Link>
            <Link to="/analytics">Analytics</Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={<Users users={users} onRefresh={fetchUsers} />} 
            />
            <Route 
              path="/analytics" 
              element={<Analytics analytics={analytics} onRefresh={fetchAnalytics} />} 
            />
            <Route 
              path="/user/:uid" 
              element={<UserDetail />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function UserDetail() {
  const [user, setUser] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [events, setEvents] = useState([]);
  const { uid } = useParams();

  useEffect(() => {
    if (uid) {
      fetchUserDetail();
    }
  }, [uid]);

  const fetchUserDetail = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/users/${uid}`);
      const data = await response.json();
      setUser(data.user);
      setAnalyses(data.analyses);
      setEvents(data.events);
    } catch (error) {
      console.error('Failed to fetch user detail:', error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="user-detail">
      <Link to="/" className="back-link">← Back to Users</Link>
      
      <div className="user-info">
        <h2>User Detail: {user.uid}</h2>
        <p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
        <p>Last Seen: {new Date(user.lastSeen).toLocaleDateString()}</p>
        <p>Selfie Count: {user.selfieCount}</p>
      </div>

      <div className="analyses-section">
        <h3>Selfie Analyses ({analyses.length})</h3>
        <div className="analyses-grid">
          {analyses.map((analysis, index) => (
            <div key={index} className="analysis-card">
              <p>Date: {new Date(analysis.createdAt).toLocaleDateString()}</p>
              <p>Face Detected: {analysis.faceDetected ? 'Yes' : 'No'}</p>
              {analysis.faceDetected && (
                <>
                  <p>Age: {analysis.estimatedAge}</p>
                  <p>Gender: {analysis.gender}</p>
                  <p>Emotion: {analysis.dominantEmotion}</p>
                </>
              )}
              <p>Brightness: {Math.round(analysis.brightness * 100)}%</p>
              <p>Clutter: {Math.round(analysis.backgroundClutter * 100)}%</p>
            </div>
          ))}
        </div>
      </div>

      <div className="events-section">
        <h3>Recent Events ({events.length})</h3>
        <div className="events-list">
          {events.map((event, index) => (
            <div key={index} className="event-item">
              <p>{event.type} - {new Date(event.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;