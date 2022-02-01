import React from 'react';
import { Helmet } from 'react-helmet';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import { uiColors } from '@leafygreen-ui/palette';
import PropTypes from 'prop-types';
import { baseUrl } from '../utils/dotcom';
import { assertTrailingSlash } from '../utils/assert-trailing-slash';

const CONTENT_MAX_WIDTH = 1440;

const Wrapper = styled('main')`
  margin: 0 auto;
  width: 100%;

  & > section,
  & > section > section {
    display: grid;
    grid-column: 1 / -1;

    // Use leftmost and rightmost grid columns as "margins" to allow the hero image
    // to span across the page while remaining as part of the document flow
    @media ${({ theme }) => theme.screenSize.mediumAndUp} {
      grid-template-columns: ${({ theme }) =>
        `minmax(${theme.size.xlarge}, 1fr) repeat(12, minmax(0, ${CONTENT_MAX_WIDTH / 12}px)) minmax(${
          theme.size.xlarge
        }, 1fr);`};
    }

    @media ${({ theme }) => theme.screenSize.upToMedium} {
      grid-template-columns: 48px repeat(12, 1fr) 48px;
    }

    @media ${({ theme }) => theme.screenSize.upToSmall} {
      grid-template-columns: ${({ theme }) => theme.size.large} 1fr ${({ theme }) => theme.size.large};
    }

    @media ${({ theme }) => theme.screenSize.upToXSmall} {
      grid-template-columns: ${({ theme }) => theme.size.medium} 1fr ${({ theme }) => theme.size.medium};
    }

    & > .card-group {
      @media ${({ theme }) => theme.screenSize.mediumAndUp} {
        grid-column: 2 / -2 !important;
      }
    }
  }
`;

// The Landing template exclusively represents docs.mongodb.com. All other landings use the ProductLanding template
const Landing = ({ children }) => {
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
            url: assertTrailingSlash(baseUrl(true)),
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
      <div>
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
            grid-column: 2 / 8;
            grid-row: 1 / 2;

            @media ${screenSize.upToMedium} {
              grid-column: 2 / 11;
            }

            @media ${screenSize.upToSmall} {
              grid-column: 2 / -2;
            }
          }
          .span-columns {
            grid-column: 3 / -3 !important;
            margin: ${size.xlarge} 0;
          }
          section > * {
            grid-column-start: 2;
            grid-column-end: 8;

            @media ${screenSize.upToMedium} {
              grid-column: 2 / -2;
            }
          }
          .hero-img {
            grid-column: 1 / -1;
            grid-row: 1 / 3;
            height: 310px;
            width: 100%;
            object-fit: cover;
            z-index: -1;

            @media ${screenSize.upToMedium} {
              grid-row: unset;
              object-position: 100%;
            }

            @media ${screenSize.upToSmall} {
              grid-row: unset;
              height: 200px;
              object-position: 85%;
            }

            @media only screen and (max-width: 320px) {
              object-position: 100%;
            }
          }
          .introduction {
            grid-column: 2 / 8;
            grid-row: 2 / 3;

            @media ${screenSize.upToMedium} {
              grid-column: 2 / -2;
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
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  pageContext: PropTypes.shape({
    page: PropTypes.object.isRequired,
  }).isRequired,
};

export default Landing;
