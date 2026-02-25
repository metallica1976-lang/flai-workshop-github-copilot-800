import React, { useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const endpoint = `${API_BASE}/api/activities/`;

  useEffect(() => {
    console.log('Activities: fetching from', endpoint);
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        console.log('Activities: fetched data', data);
        setActivities(Array.isArray(data) ? data : data.results || []);
      })
      .catch(err => {
        console.error('Activities: error', err);
        setError(err.message);
      });
  }, [endpoint]);

  if (error) return <div className="alert alert-danger status-card">⚠️ Error loading activities: {error}</div>;
  if (!activities.length) return <div className="alert alert-info status-card">Loading activities...</div>;

  return (
    <div>
      <h2 className="page-heading">🏃 Activities</h2>
      <div className="octofit-table">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Activity Type</th>
              <th>Duration</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, index) => (
              <tr key={activity.id}>
                <td>{index + 1}</td>
                <td><strong>{activity.user?.name || activity.user}</strong></td>
                <td><span className="badge" style={{backgroundColor:'#0f3460'}}>{activity.activity_type}</span></td>
                <td><span className="score-pill">{activity.duration} min</span></td>
                <td>{activity.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Activities;
