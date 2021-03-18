import React from 'react';
import { css } from '@emotion/core';
import Loadable from '@loadable/component';
import Navbar from './Navbar';
import styled from '@emotion/styled';

// Prevents Stitch functions in Banner from erroring when starting local development
const Banner = Loadable(() => import('./Banner'));

// Set Header children to be the highest z-index. Assigning this to the Header component itself
// causes the search dropdown to appear underneath the header instead of on top of the navbar.
const setHighestZIndexCss = css`
  position: relative;
  z-index: 9999;
`;

const StyledBanner = styled(Banner)`
  ${setHighestZIndexCss}
`;

const StyledNavbar = styled(Navbar)`
  ${setHighestZIndexCss}
`;

const Header = () => {
  return (
    <header
      css={css`
        grid-area: header;
      `}
    >
      <StyledBanner />
      <StyledNavbar />
    </header>
  );
};

export default Header;
