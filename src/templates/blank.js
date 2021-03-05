import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import MainColumn from '../components/MainColumn';
import { TEMPLATE_CLASSNAME } from '../constants';
import landingStyles from '../styles/landing.module.css';

const Blank = ({ children, className }) => (
  <div
    className={`${TEMPLATE_CLASSNAME} ${className}`}
    css={css`
      display: flex;
    `}
  >
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
