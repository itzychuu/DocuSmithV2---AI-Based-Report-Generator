import React from 'react';
import Navbar from '../../components/Navigation/Navbar';
import './Static.css';

const ContactUs = () => {
  return (
    <div className="static-page-container">
      <Navbar />
      <div className="static-content">
        <h1>Contact Us</h1>
        <div className="info-box">
          <p>
            Have any questions or concerns about DocuSmith? Feel free to reach out to our team.
          </p>
          <div className="contact-details" style={{ marginTop: '20px', lineHeight: '1.8' }}>
            <p><strong>Email:</strong> support@docusmith.ai</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
