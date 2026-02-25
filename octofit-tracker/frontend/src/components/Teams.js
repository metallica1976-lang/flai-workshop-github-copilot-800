import React, { useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const endpoint = `${API_BASE}/api/teams/`;

  useEffect(() => {
    console.log('Teams: fetching from', endpoint);
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        console.log('Teams: fetched data', data);
        setTeams(Array.isArray(data) ? data : data.results || []);
      })
      .catch(err => {
        console.error('Teams: error', err);
        setError(err.message);
      });
  }, [endpoint]);

  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Teams</h2>
      {teams.map(team => (
        <div key={team.id} className="card mb-3">
          <div className="card-header bg-dark text-white">
            <strong>{team.name}</strong>
          </div>
          <div className="card-body">
            <h6 className="card-subtitle mb-2 text-muted">Members</h6>
            <ul className="list-group list-group-flush">
              {(team.members || []).map(member => (
                <li key={member.id} className="list-group-item">
                  {member.name} — {member.email}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Teams;
