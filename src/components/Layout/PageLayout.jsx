import React from 'react';
import Navbar from '../Navigation/Navbar';

const PageLayout = ({ children, split = true, leftBg = 'dark', rightBg = 'green' }) => {
  if (!split) {
    return (
      <div className="page-container">
        <Navbar />
        <main>{children}</main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className={`left-panel ${leftBg === 'green' ? 'bg-green' : ''}`}>
        <Navbar variant="left" />
        <div className="content-wrapper">{Array.isArray(children) ? children[0] : children}</div>
      </div>
      <div className={`right-panel ${rightBg === 'dark' ? 'bg-dark' : ''}`}>
        <Navbar variant="right" />
        <div className="content-wrapper">{Array.isArray(children) ? children[1] : null}</div>
      </div>
    </div>
  );
};

export default PageLayout;
