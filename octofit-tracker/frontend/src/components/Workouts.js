import React, { useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState(null);
  const endpoint = `${API_BASE}/api/workouts/`;

  useEffect(() => {
    console.log('Workouts: fetching from', endpoint);
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        console.log('Workouts: fetched data', data);
        setWorkouts(Array.isArray(data) ? data : data.results || []);
      })
      .catch(err => {
        console.error('Workouts: error', err);
        setError(err.message);
      });
  }, [endpoint]);

  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Workouts</h2>
      {workouts.map(workout => (
        <div key={workout.id} className="card mb-3">
          <div className="card-header bg-dark text-white">
            <strong>{workout.name}</strong>
          </div>
          <div className="card-body">
            <p className="card-text">{workout.description}</p>
            <h6>Exercises</h6>
            <ul className="list-group list-group-flush">
              {(workout.exercises || []).map((ex, i) => (
                <li key={i} className="list-group-item">{ex}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Workouts;
