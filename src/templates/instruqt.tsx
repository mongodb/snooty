import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import MainColumn from '../components/MainColumn';

const Wrapper = styled(MainColumn)`
  max-width: unset;
  margin-right: 160px;
`;

const Instruqt = ({ children, offlineBanner }: { children: ReactNode; offlineBanner: ReactNode }) => (
  <Wrapper>
    {offlineBanner}
    {children}
  </Wrapper>
);

export default Instruqt;
