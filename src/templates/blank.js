import React from 'react';
import PropTypes from 'prop-types';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import landingStyles from '../styles/landing.module.css';

const Blank = ({ children }) => (
  <React.Fragment>
    <div className="content">
      <div className={`main-column ${landingStyles.fullWidth}`} id="main-column">
        <div className={landingStyles.document}>
          {children}
          <Footer />
        </div>
      </div>
    </div>
    <Navbar />
  </React.Fragment>
);

Blank.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
};

export default Blank;
