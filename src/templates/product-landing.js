import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import { useSiteMetadata } from '../hooks/use-site-metadata.js';
import { theme } from '../theme/docsTheme.js';

const CONTENT_MAX_WIDTH = 1200;

const Wrapper = styled('main')`
  color: ${uiColors.black};
  ${({ isGuides }) => !isGuides && `margin: 0 auto ${theme.size.xlarge} auto;`}
  width: 100%;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 600;
  }

  h1 {
    font-size: ${theme.fontSize.h2};
    margin-bottom: ${theme.size.default};
  }

  h2 {
    font-size: 21px;
    margin-top: 0px;
    margin-bottom: ${theme.size.default};
  }

  section {
    max-width: 100%;
  }

  section p {
    font-size: ${theme.fontSize.default};
    grid-column: 2;
    letter-spacing: 0.5px;
    margin-bottom: ${theme.size.small};
    max-width: 500px;
  }

  section p > a {
    font-size: ${theme.fontSize.default};
    letter-spacing: 0.5px;
    :hover {
      text-decoration: none;
    }
  }

  & > section {
    display: grid;
    // Create columns such that the 2 outer ones act like margins.
    // This will allow the hero image to span across the whole content while still being a part
    // of the DOM flow.
    grid-template-columns: minmax(${theme.size.xlarge}, 1fr) repeat(2, minmax(0, ${CONTENT_MAX_WIDTH / 2}px)) minmax(
        ${theme.size.xlarge},
        1fr
      );

    @media ${theme.screenSize.upToLarge} {
      grid-template-columns: 48px 1fr 48px;
    }

    @media ${theme.screenSize.upToMedium} {
      grid-template-columns: ${theme.size.medium} 1fr ${theme.size.medium};
    }

    h1 {
      align-self: end;
      grid-column: 2;
      grid-row: 1;
      ${({ isGuides }) =>
        isGuides &&
        `
        @media ${theme.screenSize.mediumAndUp} {
          color: ${uiColors.white};
        }
      `}
    }

    & > img {
      display: block;
      grid-column: 2;
      margin: auto;
      max-width: 600px;
      width: 100%;

      @media ${theme.screenSize.largeAndUp} {
        grid-column: 3;
        grid-row: 1 / span 2;
      }
    }

    & > .hero-img {
      grid-column: 1 / -1;
      grid-row: 1 / 3;
      height: 310px;
      ${({ isGuides }) => !isGuides && `margin-bottom: ${theme.size.large};`}
      max-width: 100%;
      object-fit: cover;
      z-index: -1;

      @media ${theme.screenSize.upToMedium} {
        object-position: 100%;
        grid-row: unset;
      }

      @media ${theme.screenSize.upToSmall} {
        grid-row: unset;
        height: 200px;
      }
    }

    & > .introduction {
      grid-column: 2;
      grid-row: 2;
      ${({ isGuides }) =>
        isGuides &&
        `
        @media ${theme.screenSize.mediumAndUp} {
          color: ${uiColors.white};
        }
      `}
    }

    & > .chapters {
      grid-column: 1 / -1;
    }

    // Sub-sections should use all but the outer columns.
    & > section {
      grid-column: 2 / -2 !important;
      overflow: hidden;
    }
    // Card-groups may occasionally not be nested within sections (see: Realm
    // PLP) but should be constrained to the inner columns regardless
    .card-group {
      grid-column: 2 / -2 !important;
    }
  }
`;

const ProductLanding = ({ children }) => {
  const { project } = useSiteMetadata();
  const isGuides = project === 'guides';
  return <Wrapper isGuides={isGuides}>{children}</Wrapper>;
};

ProductLanding.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default ProductLanding;
