import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/" className="logo-link">
            <span className="logo-text">📰 News Portal</span>
          </Link>
        </div>

        <nav className="nav">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/news" className="nav-link">
            News
          </Link>
          <Link to="/contact" className="nav-link">
            Contact
          </Link>
        </nav>

        <div className="auth-section">
          {isAuthenticated && user ? (
            <div className="user-menu">
              <Link to="/dashboard" className="user-link">
                <img src={user.avatar} alt={user.name} className="user-avatar" />
                <span>{user.name}</span>
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="auth-link login">
                Login
              </Link>
              <Link to="/register" className="auth-link register">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
