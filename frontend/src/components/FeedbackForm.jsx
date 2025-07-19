import React, { useState } from "react";

function FeedbackForm({ query, response, responseId }) {
  const [corrected, setCorrected] = useState("");
  const [stars, setStars] = useState(0);

  const sendFeedback = async () => {
    await fetch("http://localhost:8000/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: "anon",
        query,
        response_id: responseId,
        response_text: response,
        feedback_type: corrected ? "edit" : "like",
        corrected_prompt: corrected || null,
        stars,
        liked: stars >= 4
      }),
    });
    alert("Feedback submitted!");
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "5px" }}>
      <h3>Rate the Answer</h3>
      <div style={{ marginBottom: "15px" }}>
        <label>Rating (1-5): </label>
        <input 
          type="number" 
          min={1} 
          max={5} 
          value={stars} 
          onChange={e => setStars(parseInt(e.target.value))}
          style={{ marginLeft: "10px", padding: "5px" }}
        />
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label>Corrected answer (optional):</label>
        <textarea 
          placeholder="Enter corrected answer..."
          value={corrected} 
          onChange={e => setCorrected(e.target.value)}
          style={{ 
            width: "100%", 
            height: "80px", 
            marginTop: "5px", 
            padding: "10px",
            resize: "vertical"
          }}
        />
      </div>
      <button 
        onClick={sendFeedback}
        style={{ 
          padding: "10px 20px", 
          backgroundColor: "#007bff", 
          color: "white", 
          border: "none", 
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Submit Feedback
      </button>
    </div>
  );
}

export default FeedbackForm; 