import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import Loadable from '@loadable/component';
import Navbar from './Navbar';

// Prevents Stitch functions in Banner from erroring when starting local development
const Banner = Loadable(() => import('./Banner'));

// Set Header children to be the highest z-index. Assigning this to the Header component itself
// causes the search dropdown to appear underneath the navbar instead of on top of it.
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
