import React from 'react';
import PropTypes from 'prop-types';
import landingStyles from '../styles/landing.module.css';
import MainColumn from '../components/MainColumn';

const Blank = ({ children, className }) => (
  <div className={['content', className].join(' ')}>
    <MainColumn className={landingStyles.fullWidth}>
      <div className={landingStyles.document}>{children}</div>
    </MainColumn>
  </div>
);

Blank.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
  className: PropTypes.string,
};

export default Blank;
