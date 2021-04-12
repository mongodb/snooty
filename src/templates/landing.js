import React from 'react';
import { Helmet } from 'react-helmet';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import { uiColors } from '@leafygreen-ui/palette';
import PropTypes from 'prop-types';
import Sidenav from '../components/Sidenav';
import { TEMPLATE_CLASSNAME } from '../constants';

const Wrapper = styled('main')`
  margin: ${({ theme }) => `${theme.size.large} auto ${theme.size.xlarge} auto`};
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

const Landing = ({ children, className, pageContext }) => {
  const { fontSize, screenSize, size } = useTheme();
  return (
    <>
      <Helmet>
        <title>MongoDB Documentation</title>
        <script id="structured data" type="application/ld+json">
          {JSON.stringify({
            '@context': 'http://schema.org',
            '@type': 'WebSite',
            name: 'MongoDB Documentation',
            url: 'https://docs.mongodb.com/',
            publisher: {
              '@type': 'Organization',
              name: 'MongoDB',
              logo: {
                '@type': 'imageObject',
                url: 'https://webassets.mongodb.com/_com_assets/cms/mongodb_logo1-76twgcu2dm.png',
              },
            },
            author: 'MongoDB Documentation Team',
            inLanguage: 'English',
          })}
        </script>
      </Helmet>
      <Sidenav pageContext={pageContext} />
      <div className={`${TEMPLATE_CLASSNAME} ${className}`}>
        <Wrapper>{children}</Wrapper>
      </div>
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
          h1 {
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
  children: PropTypes.arrayOf(PropTypes.node),
  className: PropTypes.string,
  pageContext: PropTypes.shape({
    metadata: PropTypes.shape({
      publishedBranches: PropTypes.object,
      toctree: PropTypes.object,
    }).isRequired,
    slug: PropTypes.string,
  }).isRequired,
};

export default Landing;
