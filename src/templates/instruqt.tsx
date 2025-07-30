import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import MainColumn from '../components/MainColumn';
import { BaseTemplateProps } from '.';

const Wrapper = styled(MainColumn)`
  max-width: unset;
  margin-right: 160px;
`;

const Instruqt = ({ children, offlineBanner }: BaseTemplateProps & { children: ReactNode }) => (
  <Wrapper>
    {offlineBanner}
    {children}
  </Wrapper>
);

export default Instruqt;
