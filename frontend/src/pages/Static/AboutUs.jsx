import React from 'react';
import Navbar from '../../components/Navigation/Navbar';
import './Static.css';

const AboutUs = () => {
  return (
    <div className="static-page-container">
      <Navbar />
      <div className="static-content">
        <h1>About DocuSmith</h1>
        <div className="info-box">
          <p>
            DocuSmith is an advanced AI report generator designed to help professionals craft stunning
            reports and proposals. With features like intelligent content replacement, dynamic structure
            generation, and our conversational AI SuDOCU, preparing documentation has never been easier.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
