import React from 'react';
import PropTypes from 'prop-types';
import * as landingStyles from '../styles/landing.module.css';
import { NotFoundContainer, Wrapper } from './NotFound';

const Blank = ({ children }) => (
  <Wrapper className={landingStyles.fullWidth}>
    <NotFoundContainer>{children}</NotFoundContainer>
  </Wrapper>
);

Blank.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
};

export default Blank;
