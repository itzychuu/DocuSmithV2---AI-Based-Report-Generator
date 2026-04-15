import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');

  const { loginWithGoogle, loginWithEmail, signUpWithEmail, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
        // Note: setting displayName would require updateProfile() from Firebase Auth, 
        // but for simplicity we rely on the primary account creation here.
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">DocuSmith</h1>
        
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLogin ? 'active' : ''}`} 
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`auth-tab ${!isLogin ? 'active' : ''}`} 
            onClick={() => setIsLogin(false)}
          >
            SignUp
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <input 
              type="text" 
              placeholder="Name" 
              className="auth-input" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          )}

          <input 
            type="email" 
            placeholder="Email Address" 
            className="auth-input" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />

          <input 
            type="password" 
            placeholder="Password" 
            className="auth-input" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />

          {!isLogin && (
            <input 
              type="tel" 
              placeholder="Contact No." 
              className="auth-input" 
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          )}

          <button type="submit" className="auth-submit-btn">
            {isLogin ? 'Login' : 'SignUp'}
          </button>
        </form>

        <div className="auth-separator">
          <span>Or sign in with</span>
        </div>

        <button className="auth-google-btn" onClick={handleGoogleAuth}>
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
