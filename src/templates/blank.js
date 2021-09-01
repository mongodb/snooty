import React from 'react';
import PropTypes from 'prop-types';
import MainColumn from '../components/MainColumn';
import landingStyles from '../styles/landing.module.css';

const Blank = ({ children }) => (
  <div>
    <MainColumn className={landingStyles.fullWidth}>
      <div className={landingStyles.document}>{children}</div>
    </MainColumn>
  </div>
);

Blank.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
};

export default Blank;
