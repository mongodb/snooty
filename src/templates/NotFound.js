import React from 'react';
import { withPrefix } from 'gatsby';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Button from '@leafygreen-ui/button';
import { palette } from '@leafygreen-ui/palette';
import Footer from '../components/Footer';
import { theme } from '../theme/docsTheme';
import { baseUrl } from '../utils/base-url';
import Link from '../components/Link';

const ErrorBox = styled('div')`
  padding: 0px ${theme.size.default};

  @media ${theme.screenSize.upToSmall} {
    padding: 0px ${theme.size.default};
  }
`;

const SupportLink = styled(Link)`
  color: ${palette.gray.dark1};
  display: inline-block;
  font-size: ${theme.fontSize.small};
  line-height: 20px;
  margin-left: 16px;

  :hover {
    color: ${palette.gray.dark1};
  }

  @media ${theme.screenSize.upToSmall} {
    margin-top: ${theme.size.default};
    margin-left: 0;
  }
`;

const NotFoundImage = () => {
  const altText = 'Page not found';
  const imgPath = 'assets/404.png';

  return (
    <img
      src={withPrefix(imgPath)}
      alt={altText}
      css={css`
        width: 444px;
      `}
    />
  );
};

const ErrorBoxContainer = () => {
  return (
    <ErrorBox>
      <p
        css={css`
          font-family: 'MongoDB Value Serif';
          font-size: 32px;
          line-height: 40px;

          @media ${theme.screenSize.upToSmall} {
            font-size: ${theme.fontSize.h2};
          }
        `}
      >
        Sorry, we can't find that page.
      </p>
      <p
        css={css`
          font-size: ${theme.fontSize.default};
          line-height: 28px;
        `}
      >
        The page might have been moved or deleted.
      </p>
      <div
        css={css`
          margin-top: ${theme.size.medium};

          @media ${theme.screenSize.upToSmall} {
            display: flex;
            flex-direction: column;
          }
        `}
      >
        <Button
          href={baseUrl()}
          variant="primary"
          css={css`
            @media ${theme.screenSize.upToSmall} {
              max-width: 150px;
            }
          `}
        >
          Go to Docs Home
        </Button>
        <SupportLink to="https://support.mongodb.com/welcome" hideExternalIcon={true}>
          Contact Support →
        </SupportLink>
      </div>
    </ErrorBox>
  );
};

const NotFound = () => {
  return (
    <main>
      <div
        css={css`
          align-items: center;
          display: flex;
          flex-flow: row-reverse wrap;
          justify-content: center;
          margin-bottom: ${theme.size.xxlarge};

          @media ${theme.screenSize.upToSmall} {
            margin-top: -${theme.size.large};
          }
        `}
      >
        <NotFoundImage />
        <ErrorBoxContainer />
      </div>
      <Footer disableFeedback />
    </main>
  );
};

export default NotFound;
