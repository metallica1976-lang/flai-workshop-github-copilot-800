import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState(null);
  const endpoint = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`
    : 'http://localhost:8000/api/workouts/';

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

  if (error) return <div className="alert alert-danger status-card">⚠️ Error loading workouts: {error}</div>;
  if (!workouts.length) return <div className="alert alert-info status-card">Loading workouts...</div>;

  return (
    <div>
      <h2 className="page-heading">💪 Workouts</h2>
      <div className="row">
        {workouts.map(workout => (
          <div key={workout.id} className="col-md-6">
            <div className="octofit-card card">
              <div className="card-header">
                🏋️ {workout.name}
              </div>
              <div className="card-body">
                <p className="card-text text-muted mb-3">{workout.description}</p>
                <h6 className="fw-bold mb-2">Exercises</h6>
                <ul className="list-group list-group-flush">
                  {(workout.exercises || []).map((ex, i) => (
                    <li key={i} className="list-group-item d-flex align-items-center gap-2">
                      <span className="badge rounded-pill" style={{backgroundColor:'#e94560', minWidth:'24px'}}>{i + 1}</span>
                      {ex}
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

export default Workouts;
