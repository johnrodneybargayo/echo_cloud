import React, { useState, useEffect } from 'react';
import { IoSettingsOutline } from 'react-icons/io5';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/verbivibe_logo.png';
import './TopNavigation.css';

interface TopNavigationProps {
  fullName: string;
  photoURL: string;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ fullName, photoURL }) => {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Load the loading state from sessionStorage on mount
  useEffect(() => {
    const savedLoadingState = sessionStorage.getItem('loading');
    if (savedLoadingState === 'true') {
      setLoading(true);
    }
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    setLoading(true);
    sessionStorage.setItem('loading', 'true');  // Persist loading state

    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setLoading(false);
      sessionStorage.setItem('loading', 'false');  // Reset loading state
    }
  };

  return (
    <header className="top-navigation">
      <div className="user-info">
        <img src={photoURL} alt="Profile" className="profile-image" />
        <span className="username">{fullName}</span>
        <IoSettingsOutline className="settings-icon" onClick={toggleMenu} />
        
        {menuOpen && (
          <div className="dropdown-menu">
            <button className="dropdown-item" onClick={() => { /* Handle profile settings */ }}>
              Profile
            </button>
            <button className="dropdown-item" onClick={() => { /* Handle password reset */ }}>
              Password Reset
            </button>
            <button className="dropdown-item" onClick={handleLogout}>
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        )}
      </div>

      <div className="top-navigation-left">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      {loading && (
        <div className="loader">
          <div className="spinner"></div>
        </div>
      )}
    </header>
  );
};

export default TopNavigation;
