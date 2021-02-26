import React from 'react';
import Navbar from '../components/Navbar';
import { css } from '@emotion/core';

const Header = () => {
  return (
    <header
      css={css`
        grid-area: header;
      `}
    >
      {/* TODO: Banner */}
      <Navbar />
    </header>
  );
};

export default Header;
