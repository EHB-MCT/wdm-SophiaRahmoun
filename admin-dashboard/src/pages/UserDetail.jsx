import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"

function UserDetail() {
  const [user, setUser] = useState(null)
  const [analyses, setAnalyses] = useState([])
  const [events, setEvents] = useState([])
  const { uid } = useParams()

  useEffect(() => {
    if (uid) fetchUserDetail()
  }, [uid])

  const fetchUserDetail = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/admin/users/${uid}`
      )
      const data = await response.json()
      setUser(data.user)
      setAnalyses(data.analyses)
      setEvents(data.events)
    } catch (error) {
      console.error("Failed to fetch user detail:", error)
    }
  }

  if (!user) {
    return (
      <div className="user-detail">
        <Link to="/" className="back-link">← Back to Users</Link>
        <p className="text-muted">Loading user…</p>
      </div>
    )
  }

  return (
    <div className="user-detail">
      <Link to="/" className="back-link">← Back to Users</Link>

      <div className="user-info">
        <h2>User: {user.uid}</h2>
        <p className="text-muted">
          Created: {new Date(user.createdAt).toLocaleDateString()}
        </p>
        <p className="text-muted">
          Last Seen: {new Date(user.lastSeen).toLocaleDateString()}
        </p>
        <p className="text-muted">
          Selfie Count: {user.selfieCount}
        </p>
      </div>

      <div className="analyses-section">
        <h3>Analysis Details ({analyses.length})</h3>

        <div className="analyses-grid">
          {analyses.map((analysis, index) => (
            <div key={index} className="analysis-card">
              <p className="text-muted">
                {new Date(analysis.createdAt).toLocaleString()}
              </p>

              <div className="analysis-row">
                <strong>Face detected:</strong>{" "}
                {analysis.faceDetected ? "Yes" : "No"}
              </div>

              {analysis.faceDetected && (
                <>
                  <div className="analysis-row">
                    <strong>Estimated age:</strong> {analysis.estimatedAge}
                  </div>
                  <div className="analysis-row">
                    <strong>Gender:</strong> {analysis.gender}
                  </div>
                  <div className="analysis-row">
                    <strong>Dominant emotion:</strong>{" "}
                    {analysis.dominantEmotion}
                  </div>
                </>
              )}

              <div className="analysis-row">
                <strong>Brightness:</strong>{" "}
                {Math.round(analysis.brightness * 100)}%
              </div>

              <div className="analysis-row">
                <strong>Background clutter:</strong>{" "}
                {Math.round(analysis.backgroundClutter * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="events-section">
        <h3>Events ({events.length})</h3>

        <div className="events-list">
          {events.map((event, index) => (
            <div key={index} className="event-item text-muted">
              {event.type} –{" "}
              {new Date(event.timestamp).toLocaleString()}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserDetail