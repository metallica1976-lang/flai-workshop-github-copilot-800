import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';
import './App.css';

const NAV_LINKS = [
  { path: '/users',       label: '👤 Users' },
  { path: '/teams',       label: '🏆 Teams' },
  { path: '/activities',  label: '🏃 Activities' },
  { path: '/leaderboard', label: '📊 Leaderboard' },
  { path: '/workouts',    label: '💪 Workouts' },
];

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg octofit-navbar">
        <div className="container-fluid">
          <span className="navbar-brand">🏋️ OctoFit Tracker</span>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {NAV_LINKS.map(({ path, label }) => (
                <li className="nav-item" key={path}>
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      'nav-link' + (isActive ? ' active' : '')
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <div className="page-container">
        <Routes>
          <Route path="/" element={<Users />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

