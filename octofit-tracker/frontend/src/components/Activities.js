import React, { useState, useEffect } from 'react';

// Parse ISO date string (YYYY-MM-DD) in local time to avoid UTC offset shifting the day
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

function Activities() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const endpoint = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
    : 'http://localhost:8000/api/activities/';

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
                <td>{formatDate(activity.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Activities;
