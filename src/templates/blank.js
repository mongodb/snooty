import React from 'react';
import PropTypes from 'prop-types';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import landingStyles from '../styles/landing.module.css';

const Blank = ({ children, pageContext: { metadata, slug, __refDocMapping } }) => (
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
  pageContext: PropTypes.shape({
    __refDocMapping: PropTypes.object.isRequired,
    slug: PropTypes.string.isRequired,
  }).isRequired,
};

export default Blank;
