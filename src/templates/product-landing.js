import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/core';
import { Helmet } from 'react-helmet';
import { uiColors } from '@leafygreen-ui/palette';
import { useTheme } from 'emotion-theming';

const Wrapper = styled('main')`
  margin: ${({ theme }) => `calc(${theme.navbar.height} + ${theme.size.large}) auto ${theme.size.xlarge} auto`};
  max-width: 1150px;
  padding: 0 ${({ theme }) => `${theme.size.medium}`};
  @media ${({ theme }) => theme.screenSize.upToMedium} {
  }
  & > section,
  & > section > section {
    display: grid;
    grid-template-columns: repeat(12, [col-span] 1fr);
    grid-column: 1 / -1;
    @media ${({ theme }) => theme.screenSize.upToMedium} {
      grid-template-columns: ${({ theme }) => `${theme.size.medium} 1fr ${theme.size.medium}`};
    }
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
          h6 {
            color: ${uiColors.black};
            font-weight: bold;
          }
          h1 {
            font-size: ${fontSize.h2};
            align-self: end;
          }
          h2 {
            font-size: 21px;
            margin-top: ${size.small};
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
          .kicker {
            color: ${uiColors.gray.dark1};
            padding-top: 80px;
            font-size: 14px;
          }
          .span-columns {
            grid-column: 2 / 11 !important;
            margin: ${size.xlarge} 0;
          }
          .procedure {
            max-width: 400px;
            padding-top: 15px;
            padding-left: ${size.small};
            .landing-step {
              padding-left: 50px;
              padding-bottom: 50px;
            }
            .landing-step:not(.landing-step:last-child) {
              border-left: dashed;
              border-color: ${uiColors.gray.light2};
              border-width: 2px;
            }
          }
          .circle {
            background: ${uiColors.green.light3};
            width: 34px;
            height: 34px;
            border-radius: 50%;
            margin-bottom: -29px;
            margin-left: -67px;
            text-align: center;
          }
          .step-number {
            font-weight: bold;
            color: ${uiColors.green.dark2};
            margin: auto;
            padding-top: 6px;
          }
          @media ${screenSize.upToLarge} {
            .footer {
              padding: ${size.medium};
            }
          }
          @media ${screenSize.upToMedium} {
            .right-column {
              grid-column: 2 / -1 !important;
              grid-row-start: 4 !important;
              grid-row-end: 5 !important;
            }
          }
          @media ${screenSize.mediumAndUp} {
            .right-column {
              grid-column: 7 / -1 !important;
              grid-row-start: 1 !important;
              grid-row-end: 3 !important;
            }
          }
          @media ${screenSize.largeAndUp} {
            .right-column {
              grid-column: 9 / -1 !important;
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
