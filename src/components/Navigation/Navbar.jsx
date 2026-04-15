import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="main-navbar">
      <div className="nav-logo" onClick={() => navigate('/')}>
        DocuSmith
      </div>
      <div className="nav-links">
        <Link to="/community" className="nav-item">Community</Link>
        <Link to="/about" className="nav-item">AboutUs</Link>
        <Link to="/contact" className="nav-item">ContactUs</Link>
        <Link to="/profile" className="nav-item">Profile</Link>
      </div>
    </nav>
  );
};

export default Navbar;
