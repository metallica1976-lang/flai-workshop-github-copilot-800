import React, { useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

const EMPTY_FORM = { name: '', email: '', age: '', team_id_write: '' };

function Users() {
  const [users, setUsers]     = useState([]);
  const [teams, setTeams]     = useState([]);
  const [error, setError]     = useState(null);
  const [editing, setEditing] = useState(null);   // user object being edited
  const [form, setForm]       = useState(EMPTY_FORM);
  const [saving, setSaving]   = useState(false);
  const [saveError, setSaveError] = useState(null);

  const usersEndpoint = `${API_BASE}/api/users/`;
  const teamsEndpoint = `${API_BASE}/api/teams/`;

  const loadUsers = () =>
    fetch(usersEndpoint)
      .then(r => r.json())
      .then(d => setUsers(Array.isArray(d) ? d : d.results || []))
      .catch(e => setError(e.message));

  useEffect(() => {
    loadUsers();
    fetch(teamsEndpoint)
      .then(r => r.json())
      .then(d => setTeams(Array.isArray(d) ? d : d.results || []))
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEdit = (user) => {
    setEditing(user);
    setForm({
      name:           user.name,
      email:          user.email,
      age:            user.age,
      team_id_write:  user.team_id ?? '',
    });
    setSaveError(null);
  };

  const closeEdit = () => { setEditing(null); setSaveError(null); };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const body = {
        name:  form.name,
        email: form.email,
        age:   parseInt(form.age, 10),
        ...(form.team_id_write !== '' && { team_id_write: parseInt(form.team_id_write, 10) }),
        ...(form.team_id_write === '' && { team_id_write: null }),
      };
      const res = await fetch(`${usersEndpoint}${editing.id}/`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        throw new Error(JSON.stringify(detail));
      }
      await loadUsers();
      closeEdit();
    } catch (e) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  };

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
              <th>Username</th>
              <th>Email</th>
              <th>Age</th>
              <th>Team</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td><strong>{user.name}</strong></td>
                <td><span className="teal-pill">{user.username}</span></td>
                <td><a href={`mailto:${user.email}`} className="text-decoration-none">{user.email}</a></td>
                <td><span className="badge bg-secondary">{user.age} yrs</span></td>
                <td><span className="badge" style={{backgroundColor:'#0f3460'}}>{user.team_name || '—'}</span></td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => openEdit(user)}
                    title="Edit user"
                  >
                    ✏️ Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Edit modal ── */}
      {editing && (
        <div
          className="modal d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={e => { if (e.target === e.currentTarget) closeEdit(); }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: '14px', overflow: 'hidden' }}>

              <div className="modal-header" style={{ background: 'linear-gradient(135deg,#0d1b2a,#0f3460)', borderBottom: '3px solid #e8365d' }}>
                <h5 className="modal-title text-white">✏️ Edit User — {editing.name}</h5>
                <button className="btn-close btn-close-white" onClick={closeEdit} />
              </div>

              <div className="modal-body p-4">
                {saveError && (
                  <div className="alert alert-danger py-2 small">{saveError}</div>
                )}

                <div className="mb-3">
                  <label className="form-label fw-semibold">Full Name</label>
                  <input
                    className="form-control"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full name"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    className="form-control"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Age</label>
                  <input
                    className="form-control"
                    type="number"
                    name="age"
                    min="1"
                    value={form.age}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Team</label>
                  <select
                    className="form-select"
                    name="team_id_write"
                    value={form.team_id_write}
                    onChange={handleChange}
                  >
                    <option value="">— No team —</option>
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeEdit} disabled={saving}>
                  Cancel
                </button>
                <button
                  className="btn btn-octofit-primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving…' : '💾 Save Changes'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
