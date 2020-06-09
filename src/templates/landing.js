import React from 'react';
import { Helmet } from 'react-helmet';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import { uiColors } from '@leafygreen-ui/palette';
import PropTypes from 'prop-types';
import DocumentBody from '../components/DocumentBody';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const Wrapper = styled('main')`
  margin: ${({ theme }) => `${theme.navbar.height} auto ${theme.size.xlarge} auto`};
  max-width: 1150px;
  padding: 0 ${({ theme }) => `${theme.size.medium}`};

  @media ${({ theme }) => theme.screenSize.upToLarge} {
    max-width: 748px;
  }

  @media ${({ theme }) => theme.screenSize.upToMedium} {
    padding: 0;
  }

  & > section,
  & > section > section {
    display: grid;
    grid-template-columns: repeat(12, [col-span] 1fr);
    grid-column: 1/-1;

    @media ${({ theme }) => theme.screenSize.upToMedium} {
      grid-template-columns: ${({ theme }) => `${theme.size.medium} 1fr ${theme.size.medium}`};
    }
  }
`;

const Landing = ({ pageContext: { slug, __refDocMapping }, ...rest }) => {
  const { fontSize, screenSize, size } = useTheme();
  return (
    <>
      <Helmet>
        <title>MongoDB Documentation</title>
      </Helmet>
      <Navbar />
      <Wrapper>
        <DocumentBody refDocMapping={__refDocMapping} slug={slug} {...rest} />
      </Wrapper>
      <Footer />
      <Global
        styles={css`
          h1,
          h2,
          h3,
          h4 {
            color: ${uiColors.black};
            font-weight: bold;
          }

          h1,
          h2 {
            font-size: 32px;
            margin-bottom: ${fontSize.default};
          }

          h2 {
            margin-top: ${size.large};
          }

          p {
            color: ${uiColors.black};
            font-size: ${fontSize.default};
            letter-spacing: 0.5px;
            margin-bottom: ${size.default};
          }

          a {
            color: ${uiColors.blue.base};
            font-size: ${fontSize.default};
            letter-spacing: 0.5px;
          }

          a:hover {
            text-decoration: none;
          }

          .heading-container-h1 {
            align-self: end;
          }

          .span-columns {
            grid-column: 2 / 11 !important;
            margin: ${size.xlarge} 0;
          }

          section > * {
            grid-column-start: 1;
            grid-column-end: 7;

            @media ${screenSize.upToMedium} {
              grid-column: 2/-2;
            }
          }

          @media ${screenSize.upToLarge} {
            .footer {
              padding: ${size.medium};
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

Landing.propTypes = {
  pageContext: PropTypes.shape({
    __refDocMapping: PropTypes.object.isRequired,
    slug: PropTypes.string.isRequired,
  }).isRequired,
};

export default Landing;
