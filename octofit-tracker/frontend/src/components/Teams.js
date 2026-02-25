import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const endpoint = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
    : 'http://localhost:8000/api/teams/';

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

  if (error) return <div className="alert alert-danger status-card">⚠️ Error loading teams: {error}</div>;
  if (!teams.length) return <div className="alert alert-info status-card">Loading teams...</div>;

  return (
    <div>
      <h2 className="page-heading">🏆 Teams</h2>
      <div className="row">
        {teams.map(team => (
          <div key={team.id} className="col-md-6">
            <div className="octofit-card card">
              <div className="card-header">
                🏅 {team.name}
                <span className="badge bg-light text-dark ms-2">{(team.members || []).length} members</span>
              </div>
              <div className="card-body p-0">
                <ul className="list-group list-group-flush">
                  {(team.members || []).map(member => (
                    <li key={member.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <span><strong>{member.name}</strong></span>
                      <span className="text-muted small">{member.email}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Teams;
