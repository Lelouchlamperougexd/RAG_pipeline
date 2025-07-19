import React, { useState } from "react";
import FeedbackForm from "./components/FeedbackForm";
import DataViewer from "./components/DataViewer";

function App() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [responseId, setResponseId] = useState("");
  const [currentView, setCurrentView] = useState("chat"); // "chat" или "data"

  const sendQuery = async () => {
    const res = await fetch("http://localhost:8000/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: query }),
    });
    const data = await res.json();
    setResponse(data.response);
    setResponseId(data.response_id);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
        <h1 style={{ margin: "0 0 10px 0" }}>RAG Feedback Pipeline</h1>
        <div>
          <button 
            onClick={() => setCurrentView("chat")}
            style={{ 
              marginRight: "10px", 
              padding: "10px 20px",
              backgroundColor: currentView === "chat" ? "#007bff" : "#f8f9fa",
              color: currentView === "chat" ? "white" : "black",
              border: "1px solid #ddd",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Chat
          </button>
          <button 
            onClick={() => setCurrentView("data")}
            style={{ 
              padding: "10px 20px",
              backgroundColor: currentView === "data" ? "#007bff" : "#f8f9fa",
              color: currentView === "data" ? "white" : "black",
              border: "1px solid #ddd",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Data
          </button>
        </div>
      </div>

      {currentView === "chat" && (
        <div>
          <h2>RAG Chat</h2>
          <div style={{ marginBottom: "20px" }}>
            <input 
              value={query} 
              onChange={e => setQuery(e.target.value)}
              placeholder="Enter your question..."
              style={{ width: "70%", padding: "10px", marginRight: "10px" }}
            />
            <button onClick={sendQuery} style={{ padding: "10px 20px" }}>
              Send
            </button>
          </div>
          {response && (
            <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "5px" }}>
              <p><strong>Answer:</strong> {response}</p>
            </div>
          )}
          {response && (
            <FeedbackForm query={query} response={response} responseId={responseId} />
          )}
        </div>
      )}

      {currentView === "data" && <DataViewer />}
    </div>
  );
}

export default App; 