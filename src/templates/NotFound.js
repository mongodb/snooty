import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Button from '@leafygreen-ui/button';
import Footer from '../components/Footer';
import { theme } from '../theme/docsTheme';
import { withPrefix } from 'gatsby';

const ErrorBox = styled('div')`
  padding: 0px ${theme.size.default};

  @media ${theme.screenSize.upToSmall} {
    padding: 0px ${theme.size.default};
  }
`;

const supportButtonColor = '#3D4F58';

const SupportLink = styled('a')`
  color: ${supportButtonColor};
  display: inline-block;
  font-family: Akzidenz;
  font-size: ${theme.fontSize.default};
  letter-spacing: 0.5px;
  line-height: ${theme.size.medium};
  margin-left: ${theme.size.medium};

  :hover {
    color: ${supportButtonColor};
  }

  @media ${theme.screenSize.upToSmall} {
    margin-left: ${theme.size.tiny};
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
        width: 550px;

        @media ${theme.screenSize.upToSmall} {
          margin-bottom: 40px;
        }
      `}
    />
  );
};

const ErrorBoxContainer = () => {
  return (
    <ErrorBox>
      <p
        css={css`
          font-size: 32px;
          line-height: ${theme.size.large};

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
          line-height: ${theme.size.medium};
          margin-top: ${theme.size.medium};
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
          href="https://docs.mongodb.com"
          variant="primary"
          css={css`
            @media ${theme.screenSize.upToSmall} {
              max-width: 150px;
            }
          `}
        >
          Go to Docs Home
        </Button>
        <SupportLink
          href="https://support.mongodb.com/welcome"
          css={css`
            @media ${theme.screenSize.upToSmall} {
              margin-top: ${theme.size.default};
            }
          `}
        >
          Contact Support →
        </SupportLink>
      </div>
    </ErrorBox>
  );
};

const NotFound = () => {
  return (
    <>
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
    </>
  );
};

export default NotFound;
