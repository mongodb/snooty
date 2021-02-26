import React from 'react';
import { css } from '@emotion/core';
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
