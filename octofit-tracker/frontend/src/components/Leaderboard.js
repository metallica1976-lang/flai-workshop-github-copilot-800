import React, { useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);
  const endpoint = `${API_BASE}/api/leaderboard/`;

  useEffect(() => {
    console.log('Leaderboard: fetching from', endpoint);
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        console.log('Leaderboard: fetched data', data);
        setEntries(Array.isArray(data) ? data : data.results || []);
      })
      .catch(err => {
        console.error('Leaderboard: error', err);
        setError(err.message);
      });
  }, [endpoint]);

  if (error) return <div className="alert alert-danger status-card">⚠️ Error loading leaderboard: {error}</div>;
  if (!entries.length) return <div className="alert alert-info status-card">Loading leaderboard...</div>;

  const rankClass = i => i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';

  return (
    <div>
      <h2 className="page-heading">📊 Leaderboard</h2>
      <div className="octofit-table">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Team</th>
              <th>Total Calories</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={entry.id}>
                <td>
                  <span className={`rank-badge ${rankClass(index)}`}>{index + 1}</span>
                </td>
                <td><strong>{entry.user?.name || entry.user}</strong></td>
                <td><span className="teal-pill">{entry.team || '—'}</span></td>
                <td><span className="badge bg-warning text-dark">{entry.total_calories ?? 0} kcal</span></td>
                <td><span className="score-pill">{entry.score}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;
