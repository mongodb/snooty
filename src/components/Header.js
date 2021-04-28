import React from 'react';
import styled from '@emotion/styled';
import Banner from './Banner';
import Navbar from './Navbar';

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
