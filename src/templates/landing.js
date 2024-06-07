import React from 'react';
import styled from '@emotion/styled';
import { useTheme, Global, css } from '@emotion/react';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { palette } from '@leafygreen-ui/palette';
import PropTypes from 'prop-types';
import ChatbotUi from '../components/ChatbotUi';

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
      max-width: 1200px;
    }
  }
`;

// The Landing template exclusively represents mongodb.com/docs. All other landings use the ProductLanding template
const Landing = ({ children, pageContext, useChatbot }) => {
  const { fontSize, screenSize, size } = useTheme();
  const { darkMode } = useDarkMode();
  return (
    <>
      <div>
        <Wrapper newChatbotLanding={process.env['GATSBY_ENABLE_DARK_MODE'] !== 'true' && useChatbot}>
          {process.env['GATSBY_ENABLE_DARK_MODE'] !== 'true' && useChatbot && (
            <ChatbotUi template={pageContext?.template} />
          )}
          {children}
        </Wrapper>
      </div>
      <Global
        styles={css`
          h1,
          h2,
          h3,
          h4 {
            color: ${darkMode ? palette.gray.light2 : palette.black};
          }

          h1,
          h2 {
            font-size: 32px;
            margin-bottom: ${size.default};
          }
          h2 {
            margin-top: ${size.large};
          }
          p {
            color: ${palette.black};
            font-size: ${fontSize.small};
            letter-spacing: 0.5px;
            margin-bottom: ${size.default};
          }
          a {
            color: ${palette.blue.base};
            font-size: ${fontSize.small};
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
          main h1:first-of-type {
            color: ${darkMode ? palette.gray.light2 : palette.black};
            grid-column: 2/-1;
            margin-top: ${size.medium};
            font-size: 48px;
            line-height: 62px;
            margin-bottom: 10px;
            align-self: end;
            @media ${screenSize.upToMedium} {
              font-size: 32px;
              line-height: 40px;
              margin-top: ${size.medium};
            }
          }
          ${
            '' /* :first-of-type selector used for precedence
            above LeafyGreen class selector */
          }
          main>section>section:first-of-type h2 {
            color: ${darkMode ? palette.gray.light2 : palette.gray.dark4};
            font-size: 32px;
            font-family: 'MongoDB Value Serif';
            font-weight: 400;
            margin-top: ${size.medium};
            margin-bottom: 0px;
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
            width: 100%;
            object-fit: cover;
            z-index: -1;
            object-position: 50%;

            @media ${screenSize.upToXSmall} {
              height: 555px;
            }

            @media ${screenSize.xSmallAndUp} {
              height: 430px;
            }

            @media ${screenSize.smallAndUp} {
              height: 317px;
            }

            @media ${screenSize.largeAndUp} {
              height: 280px;
            }

            @media ${screenSize.xLargeAndUp} {
              height: 250px;
            }
          }

          .introduction {
            grid-column: 2 / -4;
            grid-row: 2 / 3;
            p {
              color: ${palette.white};
            }

            @media ${screenSize.upToMedium} {
              grid-column: 2 / -2;
            }

            @media ${screenSize.xLargeAndUp} {
              grid-column: 2 / -5;
            }

            @media ${screenSize['3XLargeAndUp']} {
              grid-column: 2 / -4;
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
    template: PropTypes.string,
  }).isRequired,
  useChatbot: PropTypes.bool,
};

export default Landing;
