import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

function useFetchCount(path) {
  const [count, setCount] = useState(null);
  useEffect(() => {
    fetch(`${API_BASE}${path}`)
      .then(res => res.json())
      .then(data => setCount(Array.isArray(data) ? data.length : (data.results?.length ?? '—')))
      .catch(() => setCount('—'));
  }, [path]);
  return count;
}

function StatCard({ icon, label, count, description, to, accentColor }) {
  const navigate = useNavigate();
  return (
    <div
      className="col-md-4 col-sm-6 mb-4"
      onClick={() => navigate(to)}
      style={{ cursor: 'pointer' }}
    >
      <div
        className="octofit-card card h-100 home-stat-card"
        style={{ borderTop: `4px solid ${accentColor}` }}
      >
        <div className="card-body d-flex flex-column align-items-start p-4">
          <div className="home-stat-icon mb-3" style={{ color: accentColor }}>
            {icon}
          </div>
          <div className="home-stat-count mb-1" style={{ color: accentColor }}>
            {count === null ? (
              <span className="spinner-border spinner-border-sm" role="status" />
            ) : count}
          </div>
          <div className="home-stat-label fw-bold mb-1">{label}</div>
          <div className="home-stat-desc text-muted small">{description}</div>
        </div>
        <div className="card-footer bg-transparent border-0 pb-3 px-4">
          <span className="small fw-semibold" style={{ color: accentColor }}>
            View {label} →
          </span>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const userCount      = useFetchCount('/api/users/');
  const activityCount  = useFetchCount('/api/activities/');
  const leaderboardCount = useFetchCount('/api/leaderboard/');
  const teamCount      = useFetchCount('/api/teams/');
  const workoutCount   = useFetchCount('/api/workouts/');

  const cards = [
    {
      icon: '👤',
      label: 'Users',
      count: userCount,
      description: 'Registered athletes and their profiles.',
      to: '/users',
      accentColor: '#0077cc',
    },
    {
      icon: '🏃',
      label: 'Activities',
      count: activityCount,
      description: 'Logged workouts and training sessions.',
      to: '/activities',
      accentColor: '#e8365d',
    },
    {
      icon: '📊',
      label: 'Leaderboard',
      count: leaderboardCount,
      description: 'Top-ranked athletes by score.',
      to: '/leaderboard',
      accentColor: '#ffc107',
    },
    {
      icon: '🏆',
      label: 'Teams',
      count: teamCount,
      description: 'Competing teams and their rosters.',
      to: '/teams',
      accentColor: '#00c9a7',
    },
    {
      icon: '💪',
      label: 'Workouts',
      count: workoutCount,
      description: 'Personalised training programmes.',
      to: '/workouts',
      accentColor: '#7c3aed',
    },
  ];

  return (
    <div>
      <div className="home-hero mb-5">
        <h1 className="home-hero-title">
          Welcome to <span style={{ color: '#e8365d' }}>Octo</span><span style={{ color: '#00c9a7' }}>Fit</span> Tracker
        </h1>
        <p className="home-hero-sub text-muted">
          Track activities, compete with your team, and crush your fitness goals.
        </p>
      </div>

      <div className="row">
        {cards.map(card => (
          <StatCard key={card.to} {...card} />
        ))}
      </div>
    </div>
  );
}

export default Home;
