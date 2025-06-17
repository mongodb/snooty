import React from 'react';
import { withPrefix } from 'gatsby';
import { css, cx } from '@leafygreen-ui/emotion';
import styled from '@emotion/styled';
import Button from '@leafygreen-ui/button';
import { palette } from '@leafygreen-ui/palette';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { Body } from '@leafygreen-ui/typography';
import { theme } from '../theme/docsTheme';
import { baseUrl } from '../utils/base-url';
import Link from '../components/Link';
import { BaseTemplateProps } from '.';

const ErrorBox = styled.div`
  max-width: 455px;
  flex: 1 0.5 auto;

  @media ${theme.screenSize.upToSmall} {
    padding: 0px ${theme.size.default};
    width: unset;
  }
`;

const getSupportLinkDynamicStyle = (darkMode: boolean) => css`
  ${!darkMode && `color: ${palette.gray.dark1};`}
  display: inline-block;
  font-size: ${theme.fontSize.small};
  line-height: 20px;
  margin-left: 16px;

  @media ${theme.screenSize.upToSmall} {
    margin-top: ${theme.size.default};
    margin-left: 0;
  }
`;

const ImageContainer = styled.div`
  max-width: 455px;
  display: flex;
  justify-content: flex-start;
  flex: 0.5 1 auto;
  > img {
    width: 100%;
    height: auto;
  }
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

const errorTitleStyling = css`
  font-family: 'MongoDB Value Serif';
  font-size: 32px;
  line-height: 40px;
  margin-block-start: 1em;
  margin-block-end: 1em;

  @media ${theme.screenSize.upToSmall} {
    font-size: ${theme.fontSize.h2};
  }
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
      <Body className={cx(errorTitleStyling)}>Sorry, we can't find that page.</Body>
      <Body>The page might have been moved or deleted.</Body>
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
        <Link
          to="https://support.mongodb.com/welcome"
          hideExternalIcon={true}
          className={cx(getSupportLinkDynamicStyle(darkMode))}
        >
          Contact Support →
        </Link>
      </LinkContainer>
    </ErrorBox>
  );
};

export const NotFoundContainer = styled.div`
  align-items: center;
  display: flex;
  flex-flow: no-wrap;
  justify-content: space-between;
  margin-bottom: ${theme.size.xxlarge};

  @media ${theme.screenSize.upToSmall} {
    margin-top: -${theme.size.large};
  }

  @media ${theme.screenSize.upToMedium} {
    grid-column: 2/-2;
    flex-flow: column-reverse;
  }

  @media ${theme.screenSize.upToLarge} {
    grid-column: 3/-3;
  }

  @media ${theme.screenSize.largeAndUp} {
    grid-column: 4/-4;
  }
  @media ${theme.screenSize.xLargeAndUp} {
    grid-column: 6/-5;
    justify-content: start;
  }
`;

export const gridStyling = `
  @media ${theme.screenSize.mediumAndUp} {
    grid-template-columns: ${`${theme.size.xlarge} repeat(12, minmax(0, 1fr)) ${theme.size.xlarge};`};
  }

  @media ${theme.screenSize.upToMedium} {
    grid-template-columns: 48px repeat(12, 1fr) 48px;
  }

  @media ${theme.screenSize.upToSmall} {
    grid-template-columns: ${theme.size.large} 1fr ${theme.size.large};
  }

  @media ${theme.screenSize.upToXSmall} {
    grid-template-columns: ${theme.size.medium} 1fr ${theme.size.medium};
  }
`;

export const Wrapper = styled('main')`
  display: grid;
  ${gridStyling}
`;

const NotFound = (props: BaseTemplateProps) => {
  return (
    <Wrapper>
      <NotFoundContainer>
        <ErrorBoxContainer />
        <NotFoundImage />
      </NotFoundContainer>
    </Wrapper>
  );
};

export default NotFound;
