// FindEndpoints.jsx
import React, { useState, useEffect } from "react";

const FindEndpoints = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const testEndpoints = async () => {
    setLoading(true);
    const endpoints = [
      // Announcement endpoints
      "/api/Admin/private/getAllAnnouncements",
      "/api/Admin/private/getAllAnnouncement",
      "/api/Admin/private/getAnnouncements", 
      "/api/Admin/private/getAnnouncement",
      "/api/Admin/private/announcements",
      "/api/announcements",
      "/announcements",
      
      // Activities endpoints
      "/api/Admin/private/getAllActivities",
      "/api/Admin/private/getAllActivity",
      "/api/Admin/private/getActivities",
      "/api/Admin/private/getActivity",
      "/api/Admin/private/activities",
      
      // Achievements endpoints  
      "/api/Admin/private/getAllAchievements",
      "/api/Admin/private/getAllAchievement",
      "/api/Admin/private/getAchievements",
      "/api/Admin/private/getAchievement",
      "/api/Admin/private/achievements",
      
      // Health check
      "/api/health",
      "/health",
      "/"
    ];

    const testResults = [];

    for (const endpoint of endpoints) {
      try {
        // Try with token
        const headers = {
          "Content-Type": "application/json",
        };
        
        const token = localStorage.getItem("accessToken");
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`http://localhost:3001${endpoint}`, {
          method: "GET",
          headers: headers,
        });

        testResults.push({
          endpoint,
          status: response.status,
          ok: response.ok,
          url: `http://localhost:3001${endpoint}`
        });

        console.log(`${endpoint}: ${response.status}`);
      } catch (error) {
        testResults.push({
          endpoint,
          status: "ERROR",
          ok: false,
          error: error.message,
          url: `http://localhost:3001${endpoint}`
        });
        console.log(`${endpoint}: ERROR - ${error.message}`);
      }
    }

    setResults(testResults);
    setLoading(false);
  };

  useEffect(() => {
    testEndpoints();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: 'monospace' }}>
      <h2>🔍 Finding Backend Endpoints</h2>
      <button 
        onClick={testEndpoints}
        style={{ padding: '10px 20px', marginBottom: 20 }}
        disabled={loading}
      >
        {loading ? 'Testing...' : 'Test Again'}
      </button>

      <table border="1" cellPadding="8" style={{ width: '100%' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th>Endpoint</th>
            <th>Status</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td>{result.endpoint}</td>
              <td>
                <span style={{
                  color: result.ok ? 'green' : result.status === 404 ? 'orange' : 'red',
                  fontWeight: 'bold'
                }}>
                  {result.ok ? '✅ 200 OK' : result.status === 404 ? '❌ 404 Not Found' : `❌ ${result.status || result.error}`}
                </span>
              </td>
              <td>
                <a href={result.url} target="_blank" rel="noopener noreferrer">
                  {result.url}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 30, padding: 15, background: '#e8f4fd' }}>
        <h3>📋 Next Steps:</h3>
        <ol>
          <li>Look for endpoints with <strong style={{ color: 'green' }}>✅ 200 OK</strong></li>
          <li>Check your backend routes file (probably in <code>src/routes/</code> or similar)</li>
          <li>Share which endpoints are working</li>
        </ol>
      </div>
    </div>
  );
};

export default FindEndpoints;