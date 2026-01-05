export default function Filters({ users, onFilter }) {
    const handleFaceDetected = (value) => {
      if (value === 'all') return onFilter(users)
      onFilter(users.filter(u => u.lastAnalysis?.faceDetected === (value === 'yes')))
    }
  
    return (
      <div className="filters">
        <select onChange={e => handleFaceDetected(e.target.value)}>
          <option value="all">All</option>
          <option value="yes">Face detected</option>
          <option value="no">No face</option>
        </select>
      </div>
    )
  }