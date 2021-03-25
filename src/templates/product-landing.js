import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/core';
import { Helmet } from 'react-helmet';
import { uiColors } from '@leafygreen-ui/palette';
import { useTheme } from 'emotion-theming';

const Wrapper = styled('main')`
  margin: ${({ theme }) => `calc(${theme.navbar.height} + ${theme.size.large}) auto ${theme.size.xlarge} auto`};
  max-width: 1200px;
  padding: 0 ${({ theme }) => `${theme.size.medium}`};

  ${'' /* First section exclusives */}
  & > section:first-of-type > h1,
  & > section:first-of-type > div {
    align-self: end;
    grid-column: 1;

    ${'' /* Handle changes induced by the FeedbackWidget */}
    @media ${({ theme }) => theme.screenSize.upToMedium} {
      align-self: flex-start;
    }
  }
  & > section:first-of-type > .introduction {
    align-self: start;
  }

  & > section {
    display: grid;
    grid-template-columns: repeat(2, [col-span] 1fr);

    @media ${({ theme }) => theme.screenSize.upToMedium} {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
    }
  }
  & > section > section {
    flex-basis: 100%;
    display: grid;
    grid-template-columns: repeat(2, [col-span] 1fr);
    grid-column: 1 / -1;
  }
  & > section > section {
    max-width: auto;
  }
  section > * {
    grid-column: 1 / -1;
  }
`;

const ProductLanding = ({ children }) => {
  const { fontSize, screenSize, size } = useTheme();

  return (
    <>
      <Helmet>
        <title>MongoDB Documentation</title>
      </Helmet>
      <Wrapper id="main-column" className="main-column">
        {children}
      </Wrapper>
      <Global
        styles={css`
          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            color: ${uiColors.black} !important;
            font-weight: 600;
          }
          h1 {
            font-size: ${fontSize.h2};
            align-self: end;
          }
          h2 {
            font-size: 21px;
            margin-top: 0px;
            margin-bottom: ${size.default};
          }
          p:not(.copyright p) {
            color: ${uiColors.black};
            font-size: ${fontSize.default};
            letter-spacing: 0.5px;
            margin-bottom: ${size.default};
            max-width: 500px;
          }
          a {
            color: ${uiColors.blue.base};
            font-size: ${fontSize.default};
            letter-spacing: 0.5px;
          }
          a:hover {
            text-decoration: none;
          }
          @media ${screenSize.upToLarge} {
            .footer {
              padding: ${size.medium};
            }
          }
          img {
            border-radius: ${size.small};
          }
          ${'' /* Handles the header image */}
          .right-column {
            grid-row: 1 / span 2;
            grid-column: 2 !important;
            @media ${screenSize.upToMedium} {
              margin-bottom: ${size.xlarge};
            }
            @media ${screenSize.upToSmall} {
              flex-basis: 100%;
              margin-bottom: ${size.large};
            }
          }
        `}
      />
    </>
  );
};

ProductLanding.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default ProductLanding;
