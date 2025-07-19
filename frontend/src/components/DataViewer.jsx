import React, { useState, useEffect } from "react";

function DataViewer() {
  const [stats, setStats] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/feedback/stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
    setLoading(false);
  };

  const fetchAllFeedback = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/feedback");
      const data = await res.json();
      setFeedbacks(data.feedbacks);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2>Feedback Data</h2>
      
      <div style={{ marginBottom: "20px" }}>
        <button 
          onClick={fetchStats}
          style={{ marginRight: "10px", padding: "10px 20px" }}
        >
          Refresh Stats
        </button>
        <button 
          onClick={fetchAllFeedback}
          style={{ padding: "10px 20px" }}
        >
          Load All Feedback
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {stats && (
        <div style={{ marginBottom: "30px", padding: "15px", border: "1px solid #ddd", borderRadius: "5px" }}>
          <h3>Statistics</h3>
          <p><strong>Total feedback:</strong> {stats.total}</p>
          <p><strong>Average rating:</strong> {stats.avg_rating}</p>
          <p><strong>With corrections:</strong> {stats.with_corrections}</p>
          <p><strong>Feedback types:</strong></p>
          <ul>
            {Object.entries(stats.feedback_types).map(([type, count]) => (
              <li key={type}>{type}: {count}</li>
            ))}
          </ul>
        </div>
      )}

      {feedbacks.length > 0 && (
        <div>
          <h3>All Feedback ({feedbacks.length})</h3>
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            {feedbacks.map((feedback, index) => (
              <div 
                key={index} 
                style={{ 
                  border: "1px solid #eee", 
                  padding: "15px", 
                  marginBottom: "10px", 
                  borderRadius: "5px",
                  backgroundColor: "#f9f9f9"
                }}
              >
                <p><strong>Query:</strong> {feedback.query}</p>
                <p><strong>Response:</strong> {feedback.response_text}</p>
                <p><strong>Rating:</strong> {feedback.stars || "Not specified"}</p>
                <p><strong>Type:</strong> {feedback.feedback_type}</p>
                {feedback.corrected_prompt && (
                  <p><strong>Correction:</strong> {feedback.corrected_prompt}</p>
                )}
                <p><strong>Response ID:</strong> {feedback.response_id}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DataViewer; 