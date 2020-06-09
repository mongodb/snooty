import React from 'react';
import PropTypes from 'prop-types';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import DocumentBody from '../components/DocumentBody';
import landingStyles from '../styles/landing.module.css';

const Blank = ({ pageContext: { slug, __refDocMapping }, ...rest }) => (
  <React.Fragment>
    <div className="content">
      <div className={`main-column ${landingStyles.fullWidth}`} id="main-column">
        <div className={landingStyles.document}>
          <div className="body">
            <DocumentBody refDocMapping={__refDocMapping} slug={slug} {...rest} />
            <Footer />
          </div>
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
