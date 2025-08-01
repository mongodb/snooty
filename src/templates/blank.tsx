import React, { ReactNode } from 'react';
import * as landingStyles from '../styles/landing.module.css';
import { NotFoundContainer, Wrapper } from './NotFound';
import { BaseTemplateProps } from '.';

const Blank = ({ children }: BaseTemplateProps & { children: ReactNode }) => (
  <Wrapper className={landingStyles.fullWidth}>
    <NotFoundContainer>{children}</NotFoundContainer>
  </Wrapper>
);

export default Blank;
