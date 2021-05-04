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
  margin: 0 auto;
  max-width: 1440px;

  & > section {
    display: grid;

    @media ${({ theme }) => theme.screenSize.mediumAndUp} {
      grid-template-columns: minmax(0, 64px) repeat(12, 1fr) minmax(0, 64px);
    }

    @media ${({ theme }) => theme.screenSize.upToMedium} {
      grid-template-columns: minmax(48px, 1fr) repeat(12, 1fr) minmax(48px, 1fr);
    }

    @media ${({ theme }) => theme.screenSize.upToSmall} {
      grid-template-columns: 32px repeat(12, 1fr) 32px;
    }

    @media only screen and (max-width: 320px) {
      grid-template-columns: repeat(14, 1fr);
    }

    // Select card group
    & > :nth-child(4) {
      @media ${({ theme }) => theme.screenSize.mediumAndUp} {
        grid-column: 2 / -2 !important;
      }
    }
  }

  & > section > section {
    display: grid;
    grid-template-columns: repeat(12, [col-span] 1fr);
    grid-column: 2 / -2;

    @media ${({ theme }) => theme.screenSize.upToMedium} {
      // grid-template-columns: ${({ theme }) => `${theme.size.medium} 1fr ${theme.size.medium}`};
      grid-template-columns: 1fr;
    }

    & > * {
      grid-column-start: 1;
      grid-column-end: 7;

      @media ${({ theme }) => theme.screenSize.upToMedium} {
        grid-column: 1/-1;
      }
    }
  }
`;

const Landing = ({ children, className, pageContext: { slug, page } }) => {
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
      <Sidenav page={page} slug={slug} />
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
            grid-column: 1 / 12 !important;
            margin: ${size.xlarge} 0;
          }
          .hero-img {
            grid-column: 1 / -1;
            grid-row: 1 / 3;
            height: 309px;
            max-width: 100%;
            object-fit: cover;
            z-index: -1;

            @media ${screenSize.upToMedium} {
              object-position: 35%;
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
              grid-column: 2 / 11;
            }

            @media ${screenSize.upToSmall} {
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
  children: PropTypes.arrayOf(PropTypes.node),
  className: PropTypes.string,
  pageContext: PropTypes.shape({
    page: PropTypes.object.isRequired,
  }).isRequired,
};

export default Landing;
