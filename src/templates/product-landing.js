import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { useSiteMetadata } from '../hooks/use-site-metadata.js';
import { theme } from '../theme/docsTheme.js';
import { findKeyValuePair } from '../utils/find-key-value-pair.js';

const CONTENT_MAX_WIDTH = 1200;

const Wrapper = styled('main')`
  ${({ isGuides }) => !isGuides && `margin: 0 auto ${theme.size.xlarge} auto;`}
  width: 100%;

  h1 {
    color: black;
  }

  h2 {
    margin-top: ${theme.size.small};
    margin-bottom: ${theme.size.small};
  }

  h3 {
    font-weight: 600;
    font-size: 16px;
    line-height: 28px;
    margin-bottom: 8px;
  }

  section {
    max-width: 100%;
  }

  section p {
    grid-column: 2;
    max-width: 500px;
  }

  section p > a {
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
    grid-template-rows: [header] auto [introduction] auto [kicker] auto;
    ${({ hasBanner }) =>
      hasBanner && `grid-template-rows: [banner] auto [header] auto [introduction] auto [kicker] auto;`}

    @media ${theme.screenSize.upToLarge} {
      grid-template-columns: 48px 1fr 48px;
    }

    @media ${theme.screenSize.upToMedium} {
      grid-template-columns: ${theme.size.medium} 1fr ${theme.size.medium};
    }

    [role='alert'] {
      grid-column: 2 / 3;
      grid-row: banner;
      align-items: center;
    }

    h1 {
      align-self: end;
      grid-column: 2;
      grid-row: header;

      ${({ isGuides }) =>
        isGuides &&
        `
        @media ${theme.screenSize.mediumAndUp} {
          color: ${palette.white};
        }
      `}
    }

    > img {
      display: block;
      grid-column: 2;
      margin-top: auto;
      max-width: 600px;
      width: 100%;

      @media ${theme.screenSize.largeAndUp} {
        grid-column: 3;
        grid-row: header/span 2;
      }
    }

    > .hero-img {
      grid-column: 1 / -1;
      grid-row: header / kicker;
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

    > .introduction {
      grid-column: 2;
      grid-row: introduction;
      p {
        ${({ isGuides }) =>
          isGuides &&
          `
            @media ${theme.screenSize.mediumAndUp} {
                color: ${palette.white};
            }
        `}
      }
    }

    > .chapters {
      grid-column: 1 / -1;
    }

    // Sub-sections should use all but the outer columns.
    > section {
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
  const useHero = ['guides', 'realm'].includes(project);
  const isGuides = project === 'guides';

  // shallow copy children, and search for existence of banner
  const shallowChildren = children.reduce((res, child) => {
    const copiedChildren = child.props.nodeData.children.map((childNode) => {
      const newNode = {};
      for (let property in childNode) {
        if (property !== 'children') {
          newNode[property] = childNode[property];
        }
      }
      return newNode;
    });
    res = res.concat(copiedChildren);
    return res;
  }, []);

  const bannerNode = findKeyValuePair([{ children: shallowChildren }], 'name', 'banner');

  return (
    <Wrapper isGuides={isGuides} useHero={useHero} hasBanner={!!bannerNode}>
      {children}
    </Wrapper>
  );
};

ProductLanding.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default ProductLanding;
