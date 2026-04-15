import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navigation/Navbar';
import '../Static/Static.css';
import { getProjects } from '../../services/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  return (
    <div className="static-page-container">
      <Navbar />
      <div className="static-content">
        <div className="profile-header">
          <h1>Profile</h1>
          <button className="btn-outline" onClick={logout}>Logout</button>
        </div>
        
        <div className="user-info">
          {user?.photoURL && <img src={user.photoURL} alt="Profile" className="profile-pic" />}
          <h2>{user?.displayName || 'User Name'}</h2>
          <p>{user?.email}</p>
        </div>

        <div className="history-section">
          <h3>Project History</h3>
          {projects.length === 0 ? (
            <div className="empty-history">
              <p>No projects are made yet.</p>
            </div>
          ) : (
            <div className="history-list">
              {projects.map((project) => (
                <div key={project.id} className="history-item" style={{marginBottom: '12px', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)'}}>
                  <h4 style={{margin: '0 0 4px'}}>{project.title}</h4>
                  <p style={{margin: '0 0 4px', opacity: 0.7, fontSize: '0.9em'}}>{project.preview}...</p>
                  <small style={{opacity: 0.5}}>{project.date}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
