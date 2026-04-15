import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navigation/Navbar';
import './../Static/Static.css';
import { getPublicProjects } from '../../services/api';

const Community = () => {
  const [publicProjects, setPublicProjects] = useState([]);

  useEffect(() => {
    setPublicProjects(getPublicProjects());
  }, []);

  return (
    <div className="static-page-container">
      <Navbar />
      <div className="static-content">
        <h1>Community</h1>
        <div className="warning-box">
          <p>Important: Please do not make sensitive or confidential content public. The community page is for sharing reports as references for others.</p>
        </div>
        {publicProjects.length === 0 ? (
          <div className="empty-state">
            <p>No public projects yet. Be the first to share your stunning reports!</p>
          </div>
        ) : (
          <div className="community-list">
            {publicProjects.map((project) => (
              <div key={project.id} className="community-item" style={{marginBottom: '12px', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)'}}>
                <h4 style={{margin: '0 0 4px'}}>{project.title}</h4>
                <p style={{margin: '0 0 4px', opacity: 0.7, fontSize: '0.9em', whiteSpace: 'pre-wrap'}}>{project.preview}...</p>
                <small style={{opacity: 0.5}}>{project.date}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
