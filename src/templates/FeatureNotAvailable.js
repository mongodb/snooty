import React from 'react';
import { withPrefix } from 'gatsby';
import { css, cx } from '@leafygreen-ui/emotion';
import styled from '@emotion/styled';
import Button from '@leafygreen-ui/button';
import { H2 } from '@leafygreen-ui/typography';
import { theme } from '../theme/docsTheme';
import Breadcrumbs from '../components/Breadcrumbs';
import ChatbotUi from '../components/ChatbotUi';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';

const StyledMain = styled.main`
  max-width: 100vw;
  .body {
    margin: ${theme.size.default} ${theme.size.xlarge} ${theme.size.xlarge};
    @media ${theme.screenSize.upToSmall} {
      margin: ${theme.size.default} 48px ${theme.size.xlarge};
    }
  }
`;

const ContentBox = styled.div`
  max-width: 560px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  margin-top: 120px;
  @media ${theme.screenSize.upToSmall} {
    margin-top: ${theme.size.medium};
  }
  margin-bottom: ${theme.size.default};
  img {
    @media ${theme.screenSize.upToSmall} {
      height: 180px;
      width: 270px;
    }
  }
`;

const FeatureNotAvailImage = () => {
  const altText = 'Feature not available';
  const imgPath = 'assets/feature-not-avail.svg';

  return (
    <ImageContainer>
      <img src={withPrefix(imgPath)} alt={altText} height={240} width={360} />
    </ImageContainer>
  );
};

const titleStyling = (darkMode) => css`
  color: ${darkMode ? 'white' : 'black'};
  text-align: center;
`;

const LinkContainer = styled.div`
  margin-top: ${theme.size.large};
`;

const click = () => {
  history.back();
};

const FeatureNotAvailContainer = styled.div`
  align-items: center;
  display: flex;
  flex-flow: column;
  justify-content: center;
  margin-bottom: ${theme.size.xxlarge};
`;

const FeatureNotAvailable = () => {
  // const { displayName, slug } = splitUrlIntoParts(
  //   'https://www.mongodb.com/docs/atlas/atlas-search/atlas-search-overview/'
  // );
  let parentPaths, queriedCrumbs, siteTitle, slug, pageTitle;
  if (typeof window !== 'undefined') {
    parentPaths = JSON.parse(sessionStorage.getItem('parentPaths'));
    queriedCrumbs = JSON.parse(sessionStorage.getItem('queriedCrumbs'));
    siteTitle = sessionStorage.getItem('siteTitle');
    slug = sessionStorage.getItem('slug');
    pageTitle = sessionStorage.getItem('pageTitle');
  }

  const selfBreadcrumb = {
    title: pageTitle,
    slug: `/${slug}`,
  };

  const { darkMode } = useDarkMode();

  return (
    <StyledMain>
      <div class="body">
        {process.env['GATSBY_ENABLE_DARK_MODE'] !== 'true' && <ChatbotUi template="errorpage" />}
        {typeof window !== 'undefined' && (
          <Breadcrumbs
            siteTitle={siteTitle}
            slug={slug}
            defParentPaths={parentPaths}
            defQueriedCrumbs={queriedCrumbs}
            selfCrumbContent={selfBreadcrumb}
          />
        )}
        <FeatureNotAvailContainer>
          <FeatureNotAvailImage />
          <ContentBox>
            <H2 darkMode={darkMode} className={cx(titleStyling(darkMode))}>
              We're sorry, this page isn't available in the version you selected.
            </H2>
            <LinkContainer>
              <Button onClick={click} variant="default">
                Go back to previous page
              </Button>
            </LinkContainer>
          </ContentBox>
        </FeatureNotAvailContainer>
      </div>
    </StyledMain>
  );
};

export default FeatureNotAvailable;
