export default function Analytics({ analytics, onRefresh }) {
  if (!analytics) {
    return <div className="analytics-page">Loading analytics...</div>;
  }

  const renderEmotionChart = () => {
    const emotions = analytics.emotionBreakdown;
    const total = analytics.totalAnalyses;
    
    return (
      <div className="emotion-chart">
        <h4>Emotion Distribution</h4>
        {Object.entries(emotions).map(([emotion, count]) => (
          <div key={emotion} className="emotion-bar">
            <span>{emotion}: </span>
            <div className="bar">
              <div 
                className="bar-fill" 
                style={{ width: `${(count / total) * 100}%` }}
              ></div>
            </div>
            <span>{count} ({Math.round((count / total) * 100)}%)</span>
          </div>
        ))}
      </div>
    );
  };

  const renderGenderChart = () => {
    const genders = analytics.genderBreakdown;
    const total = analytics.totalAnalyses;
    
    return (
      <div className="gender-chart">
        <h4>Gender Distribution</h4>
        {Object.entries(genders).map(([gender, count]) => (
          <div key={gender} className="gender-item">
            <span>{gender}: </span>
            <strong>{count} ({Math.round((count / total) * 100)}%)</strong>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h1>Analytics</h1>
        <button onClick={onRefresh} className="refresh-btn">Refresh</button>
      </div>

      <div className="overview-cards">
        <div className="card">
          <h3>Total Analyses</h3>
          <p className="big-number">{analytics.totalAnalyses}</p>
        </div>
        <div className="card">
          <h3>Average Age</h3>
          <p className="big-number">{analytics.avgAge}</p>
        </div>
        <div className="card">
          <h3>Average Brightness</h3>
          <p className="big-number">{Math.round(analytics.avgBrightness * 100)}%</p>
        </div>
        <div className="card">
          <h3>Average Clutter</h3>
          <p className="big-number">{Math.round(analytics.avgClutter * 100)}%</p>
        </div>
      </div>

      <div className="charts">
        <div className="chart-container">
          {renderEmotionChart()}
        </div>
        
        <div className="chart-container">
          {renderGenderChart()}
        </div>
      </div>
    </div>
  );
}