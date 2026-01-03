export default function Analytics({ analytics, onRefresh }) {
  if (!analytics) {
    return (
      <div className="analytics-page">
        <h1>Analytics</h1>
        <p>No analytics data available.</p>
        <button onClick={onRefresh}>Refresh</button>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <h1>Analytics</h1>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Total Users</h3>
          <p>{analytics.totalUsers}</p>
        </div>

        <div className="analytics-card">
          <h3>Total Selfies</h3>
          <p>{analytics.totalSelfies}</p>
        </div>

        <div className="analytics-card">
          <h3>Total Events</h3>
          <p>{analytics.totalEvents}</p>
        </div>
      </div>

      <button onClick={onRefresh}>Refresh</button>
    </div>
  );
}