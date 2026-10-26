import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  FileText,
  BarChart3,
  History,
  LayoutDashboard,
  Home,
  Sun,
  Moon,
  LogOut,
  User,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { getStoredUser, removeStoredToken } from '../services/api';

export default function Navbar({ activePage, setActivePage }) {
  const [theme, setTheme] = useState(localStorage.getItem('loan_theme') || 'dark');
  const [user, setUser] = useState(getStoredUser());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('loan_theme', theme);
  }, [theme]);

  // Sync user state
  const handleAuthChange = () => {
    setUser(getStoredUser());
  };

  useEffect(() => {
    window.addEventListener('storage', handleAuthChange);
    return () => window.removeEventListener('storage', handleAuthChange);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = () => {
    removeStoredToken();
    setUser(null);
    setActivePage('landing');
  };

  const navItems = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'apply', label: 'Loan Application', icon: FileText },
    { id: 'models', label: 'ML Models', icon: BrainCircuit },
    { id: 'history', label: 'History', icon: History },
    { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
  ];

  return (
    <header className="navbar">
      <div className="nav-brand" onClick={() => setActivePage('landing')} style={{ cursor: 'pointer' }}>
        <div className="brand-icon">
          <BrainCircuit size={22} />
        </div>
        <span>
          Fin<span className="brand-text-highlight">ML</span> LoanAI
        </span>
      </div>

      <nav className="nav-links">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div className="nav-actions">
        <button
          className="btn btn-icon-only"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'var(--bg-tertiary)',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <User size={14} />
              {user.name.split(' ')[0]}
              {user.role === 'admin' && (
                <ShieldCheck size={14} style={{ color: 'var(--accent-primary)' }} title="Administrator" />
              )}
            </span>
            <button
              className="btn btn-outline"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
              onClick={handleLogout}
              title="Sign Out"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button
            className="btn btn-primary"
            style={{ padding: '0.45rem 1.1rem', fontSize: '0.88rem' }}
            onClick={() => setActivePage('auth')}
          >
            Sign In / Demo
          </button>
        )}

        <button
          className="btn btn-icon-only mobile-toggle"
          onClick={() => setMobileMenuOpen(prev => !prev)}
          style={{ display: 'none' }}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
}
