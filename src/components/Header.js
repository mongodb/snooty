import React from 'react';
import { css } from '@emotion/core';
import Loadable from '@loadable/component';
import { BannerContextProvider } from './banner-context';
import Navbar from './Navbar';

// Prevents Stitch functions in Banner from erroring when starting local development
const Banner = Loadable(() => import('./Banner'));

const Header = () => {
  return (
    <header
      css={css`
        grid-area: header;
      `}
    >
      <BannerContextProvider>
        <Banner />
        <Navbar />
      </BannerContextProvider>
    </header>
  );
};

export default Header;
