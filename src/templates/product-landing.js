import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import { theme } from '../theme/docsTheme.js';

const Wrapper = styled('main')`
  color: ${uiColors.black};
  margin: calc(${theme.navbar.height} + ${theme.size.large}) auto ${theme.size.xlarge} auto;
  max-width: 1200px;
  padding: 0 ${theme.size.large};

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
    letter-spacing: 0.5px;
    margin-bottom: ${theme.size.small};
    max-width: 500px;
  }

  section p > a {
    color: ${uiColors.blue.base};
    font-size: ${theme.fontSize.default};
    letter-spacing: 0.5px;
    :hover {
      text-decoration: none;
    }
  }

  & > section {
    h1 {
      align-self: end;
    }

    ${'' /* Split the content into two columns on large screens. */}
    @media ${theme.screenSize.mediumAndUp} {
      display: grid;
      grid-template-columns: 1fr 1fr;

      & > h1,
      & > .introduction {
        grid-column: 1;
      }

      & > .right-column {
        grid-column: 2;
        grid-row: 1 / span 2;
      }

      ${'' /* Sub-sections should take up the full width of the main section */}
      & > section {
        grid-column: 1 / -1;
      }
    }
  }
`;

const ProductLanding = ({ children }) => (
  <Wrapper id="main-column" className="main-column">
    {children}
  </Wrapper>
);

ProductLanding.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default ProductLanding;
