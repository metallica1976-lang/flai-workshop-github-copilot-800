import React, { useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const endpoint = `${API_BASE}/api/users/`;

  useEffect(() => {
    console.log('Users: fetching from', endpoint);
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        console.log('Users: fetched data', data);
        setUsers(Array.isArray(data) ? data : data.results || []);
      })
      .catch(err => {
        console.error('Users: error', err);
        setError(err.message);
      });
  }, [endpoint]);

  if (error) return <div className="alert alert-danger status-card">⚠️ Error loading users: {error}</div>;
  if (!users.length) return <div className="alert alert-info status-card">Loading users...</div>;

  return (
    <div>
      <h2 className="page-heading">👤 Users</h2>
      <div className="octofit-table">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td><strong>{user.name}</strong></td>
                <td><a href={`mailto:${user.email}`} className="text-decoration-none">{user.email}</a></td>
                <td><span className="badge bg-secondary">{user.age} yrs</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
