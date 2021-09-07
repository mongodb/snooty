import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';

const containerCSS = css`
  display: flex;
  align-items: center;
  padding: 0px 16px;
  line-height: 1.6;
`;

const logoCSS = css`
  height: 23px;
`;

const SidenavDocsLogo = ({ border }) => {
  const logoSource = 'https://docs.mongodb.com/images/mongodb-logo.png';
  return (
    <>
      <div css={containerCSS}>
        <img css={logoCSS} src={logoSource} alt="MongoDB" />
        <span>&nbsp;| Documentation</span>
      </div>
      {border}
    </>
  );
};

SidenavDocsLogo.propTypes = {
  border: PropTypes.element,
};

export default SidenavDocsLogo;
