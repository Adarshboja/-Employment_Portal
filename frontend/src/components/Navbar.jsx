import { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import './Navbar.css';
import { MdPerson, MdLogout, MdLogin, MdAppRegistration, MdBookmarkBorder } from 'react-icons/md';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const seekerLinks = [
    { to: '/jobs', label: 'Jobs' },
    { to: '/saved', label: 'Saved' },
    { to: '/my-applications', label: 'Applications' },
  ];

  const recruiterLinks = [
    { to: '/jobs', label: 'Jobs' },
    { to: '/recruiter/dashboard', label: 'Dashboard' },
  ];

  const commonLinks = user?.role === 'Recruiter' ? recruiterLinks : seekerLinks;

  return (
    <header className="nav-shell">
      <div className="nav-container">
        <Link to={user ? '/jobs' : '/login'} className="brand">
          <div className="brand-mark">
            <span className="brand-dot" />
          </div>
          <div className="brand-text">
            <strong>Employment Portal</strong>
            <small>Hire. Apply. Decide faster.</small>
          </div>
        </Link>

        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {user && (
            <>
              {commonLinks.map((link) => (
                <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)}>
                  {link.label}
                </NavLink>
              ))}
              <NavLink to="/profile" onClick={() => setOpen(false)}>
                Profile
              </NavLink>
            </>
          )}
        </nav>

        <div className="nav-actions">
          {user && user.role === 'Seeker' && (
            <NavLink to="/saved" className="icon-link" title="Saved Jobs">
              <MdBookmarkBorder size={22} />
            </NavLink>
          )}
          <button className="icon-link" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
          {user && (
            <button className="pill" onClick={handleLogout}>
              <MdLogout size={18} /> Logout
            </button>
          )}
          {user && (
            <Link to="/profile" className="avatar-chip">
              <MdPerson size={20} />
              <span>{user.name?.split(' ')[0] || 'You'}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
