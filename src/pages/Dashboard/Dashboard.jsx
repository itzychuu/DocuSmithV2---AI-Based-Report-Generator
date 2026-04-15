import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navigation/Navbar';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 'replace',
      title: 'Replace Content',
      image: '/ImagesUsed/SomeoneWritingAContract.jpeg',
      route: '/replace-content'
    },
    {
      id: 'generate',
      title: 'Generate Content',
      image: '/ImagesUsed/SomeoneWrtingUsingRedPencil.jpeg',
      route: '/generate-content'
    },
    {
      id: 'proposal',
      title: 'Proposal Writing',
      image: '/ImagesUsed/BusinessProposal.jpeg',
      route: '/proposal-writing'
    }
  ];

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <div className="dashboard-hero">
          <h1>DocuSmith</h1>
          <p>Craft professional reports and proposals with AI-driven structure, control, and precision.</p>
        </div>
        <div className="feature-cards">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className="feature-card" 
              onClick={() => navigate(feature.route)}
            >
              <div className="card-image" style={{ backgroundImage: `url(${feature.image})` }}></div>
              <div className="card-footer">
                <h3>{feature.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
