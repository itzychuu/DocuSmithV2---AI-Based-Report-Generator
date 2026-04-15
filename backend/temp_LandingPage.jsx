import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navigation/Navbar';
import './LandingPage.css';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="landing-container">
      <Navbar />
      <div className="landing-split">
        <div className="landing-left"></div>
        <div className="landing-right"></div>
      </div>
      <div className="hero-content">
        <h1>DocuSmith</h1>
        <p>Craft professional reports and proposals with AI-driven structure, control, and precision.</p>
        <button className="btn-outline login-btn" onClick={() => navigate('/auth')}>
          Login/SignUp
        </button>
      </div>
    </div>
  );
};


export default LandingPage;
