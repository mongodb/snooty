import React from 'react';
import styled from '@emotion/styled';
import SiteBanner from './SiteBanner';
import Navbar from './Navbar';

const StyledHeaderContainer = styled.header`
  grid-area: header;
  z-index: 10;
`;

const Header = () => {
  return (
    <StyledHeaderContainer>
      <SiteBanner />
      <Navbar />
    </StyledHeaderContainer>
  );
};

export default Header;
