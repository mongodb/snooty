import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { theme } from '../theme/docsTheme';

// TODO: Possibly remove this after docs-nav is merged
const calculateMarginTop = (bannerHeight) => `
  calc(${theme.bannerContent.enabled ? bannerHeight : '0px'} + 45px)
`;

const OpenAPITemplate = ({ children }) => (
  <div
    css={css`
      // Prevent loading animation from being side by side with footer when using flex
      display: block;
      margin-top: ${calculateMarginTop(theme.navbar.bannerHeight.small)} !important;

      @media ${theme.screenSize.upToMedium} {
        margin-top: ${calculateMarginTop(theme.navbar.bannerHeight.medium)} !important;
      }

      @media not all and (max-width: 1600px) {
        margin-top: ${calculateMarginTop(theme.navbar.bannerHeight.large)} !important;
      }
    `}
  >
    {children}
  </div>
);

OpenAPITemplate.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
};

export default OpenAPITemplate;
