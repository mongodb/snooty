import React from 'react';
import { css } from '@emotion/core';
import Loadable from '@loadable/component';
import Navbar from '../components/Navbar';

// Prevents Stitch functions in Banner from erroring when starting local development
const Banner = Loadable(() => import('../components/Banner'));

const Header = () => {
  return (
    <header
      css={css`
        grid-area: header;
      `}
    >
      <Banner />
      <Navbar />
    </header>
  );
};

export default Header;
