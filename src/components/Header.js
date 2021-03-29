import React from 'react';
import styled from '@emotion/styled';
import Loadable from '@loadable/component';
import Navbar from './Navbar';

// Prevents Stitch functions in Banner from erroring when starting local development
const Banner = Loadable(() => import('./Banner'));

const StyledHeaderContainer = styled.header`
  grid-area: header;
  z-index: 10;
`;

const Header = () => {
  return (
    <StyledHeaderContainer>
      <Banner />
      <Navbar />
    </StyledHeaderContainer>
  );
};

export default Header;
