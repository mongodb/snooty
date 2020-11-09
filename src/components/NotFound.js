import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Button from '@leafygreen-ui/button';
import Footer from './Footer';
import { theme } from '../theme/docsTheme';
import { withPrefix } from 'gatsby';

const ErrorBox = styled('div')`
  padding-left: ${theme.size.small};
  padding-right: ${theme.size.small};

  @media ${theme.screenSize.upToSmall} {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

const supportButtonColor = '#3D4F58';

const SupportButton = styled('a')`
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
`;

const NotFoundImage = () => {
  const altText = 'Page not found';
  const imgPath = 'assets/404.png';

  return (
    <img
      src={withPrefix(imgPath)}
      alt={altText}
      css={css`
        width: 50%;

        @media ${theme.screenSize.upToSmall} {
          width: 100%;
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
            text-align: center;
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
        `}
      >
        <Button variant="primary" href="https://docs.mongodb.com">
          Go to Docs Home
        </Button>
        <SupportButton href="https://support.mongodb.com/welcome">Contact Support →</SupportButton>
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
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: ${theme.size.xxlarge};
        `}
      >
        <ErrorBoxContainer />
        <NotFoundImage />
      </div>
      <Footer enableFeedback={false} />
    </>
  );
};

export default NotFound;
