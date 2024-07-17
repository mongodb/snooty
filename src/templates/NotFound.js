import React from 'react';
import { withPrefix } from 'gatsby';
import { css, cx } from '@leafygreen-ui/emotion';
import styled from '@emotion/styled';
import Button from '@leafygreen-ui/button';
import { palette } from '@leafygreen-ui/palette';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { theme } from '../theme/docsTheme';
import { baseUrl } from '../utils/base-url';
import Link from '../components/Link';
import ChatbotUi from '../components/ChatbotUi';

const ErrorBox = styled('div')`
  padding: 0 0 0 ${theme.size.default};
  max-width: 455px;

  @media ${theme.screenSize.upToSmall} {
    padding: 0px ${theme.size.default};
    width: unset;
  }
`;

const SupportLink = styled(Link)`
  display: inline-block;
  font-size: ${theme.fontSize.small};
  line-height: 20px;
  margin-left: 16px;

  @media ${theme.screenSize.upToSmall} {
    margin-top: ${theme.size.default};
    margin-left: 0;
  }
`;

const getSupportLinkDynamicStyle = (darkMode) => css`
  ${!darkMode && `color: ${palette.gray.dark1};`}
`;

const ImageContainer = styled.div`
  width: 455px;
  display: flex;
  justify-content: center;
  align-content: center;
`;

const NotFoundImage = () => {
  const altText = 'Page not found';
  const imgPath = 'assets/404.png';

  return (
    <ImageContainer>
      <img src={withPrefix(imgPath)} alt={altText} height={444} width={444} />
    </ImageContainer>
  );
};

const ErrorTitle = styled.p`
  font-family: 'MongoDB Value Serif';
  font-size: 32px;
  line-height: 40px;

  @media ${theme.screenSize.upToSmall} {
    font-size: ${theme.fontSize.h2};
  }
`;

const ErrorSubtitle = styled.p`
  font-size: ${theme.fontSize.default};
  line-height: 28px;
`;

const LinkContainer = styled.div`
  margin-top: ${theme.size.medium};

  @media ${theme.screenSize.upToSmall} {
    display: flex;
    flex-direction: column;
  }
`;

const ErrorBoxContainer = () => {
  const { darkMode } = useDarkMode();
  return (
    <ErrorBox>
      <ErrorTitle>Sorry, we can't find that page.</ErrorTitle>
      <ErrorSubtitle>The page might have been moved or deleted.</ErrorSubtitle>
      <LinkContainer>
        <Button
          href={baseUrl()}
          variant="primary"
          className={cx(css`
            @media ${theme.screenSize.upToSmall} {
              max-width: 150px;
            }
          `)}
        >
          Go to Docs Home
        </Button>
        <SupportLink
          to="https://support.mongodb.com/welcome"
          hideExternalIcon={true}
          className={cx(getSupportLinkDynamicStyle(darkMode))}
        >
          Contact Support →
        </SupportLink>
      </LinkContainer>
    </ErrorBox>
  );
};

const NotFoundContainer = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row-reverse wrap;
  justify-content: center;
  margin-bottom: ${theme.size.xxlarge};

  @media ${theme.screenSize.upToSmall} {
    margin-top: -${theme.size.large};
  }
`;

const NotFound = () => {
  return (
    <main>
      {process.env['GATSBY_ENABLE_DARK_MODE'] !== 'true' && <ChatbotUi template="errorpage" />}
      <NotFoundContainer>
        <NotFoundImage />
        <ErrorBoxContainer />
      </NotFoundContainer>
    </main>
  );
};

export default NotFound;
