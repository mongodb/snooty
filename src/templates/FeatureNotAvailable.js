import React, { useContext } from 'react';
import { withPrefix } from 'gatsby';
import { css, cx } from '@leafygreen-ui/emotion';
import styled from '@emotion/styled';
import Button from '@leafygreen-ui/button';
import { H2 } from '@leafygreen-ui/typography';
import { theme } from '../theme/docsTheme';
import Breadcrumbs from '../components/Breadcrumbs';
import ChatbotUi from '../components/ChatbotUi';
import useSnootyMetadata from '../utils/use-snooty-metadata';
import { PageContext } from '../context/page-context';
import { splitUrlIntoParts } from '../utils/split-url-into-parts';

const StyledMain = styled.main`
  margin: 16px 64px 64px;
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

// change this to our image
const FeatureNotAvailImage = () => {
  const altText = 'Feature not available';
  const imgPath = 'assets/feature-not-avail.svg';

  return (
    <ImageContainer>
      <img src={withPrefix(imgPath)} alt={altText} height={240} width={360} />
    </ImageContainer>
  );
};

const titleStyling = css`
  color: black;
  text-align: center;
`;

const LinkContainer = styled.div`
  margin-top: ${theme.size.large};
`;

//const { displayName, slug } = splitUrlIntoParts('https://www.mongodb.com/docs/bi-connector/current/launch');

const click = () => {
  history.back();
};
const ContentContainer = () => {
  // const ref = typeof window === 'undefined' ? null : window.document.referrer;
  // console.log('REFERENCE', ref);
  // console.log('TYPE', typeof ref);
  // page context
  // site title
  //   const { slug } = useContext(PageContext);
  //   console.log('SLUG', slug);
  //   const { title } = useSnootyMetadata();
  //   console.log('TITLTE', title);

  return (
    <ContentBox>
      <H2 className={cx(titleStyling)}>We're sorry, this page isn't available in the version you selected.</H2>
      <LinkContainer>
        <Button onClick={click} variant="default">
          Go back to previous page
        </Button>
      </LinkContainer>
    </ContentBox>
  );
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
  let parentPaths, queriedCrumbs, siteTitle, slug;
  if (typeof window !== 'undefined') {
    parentPaths = JSON.parse(sessionStorage.getItem('parentPaths'));
    queriedCrumbs = JSON.parse(sessionStorage.getItem('queriedCrumbs'));
    siteTitle = sessionStorage.getItem('siteTitle');
    slug = sessionStorage.getItem('slug');
    console.log('PARENTPATHS', parentPaths, 'QUEREIDCRUMBES', queriedCrumbs);
    console.log('SITE TITLE', siteTitle, 'SLUG', slug);
    //console.log('Data', JSON.stringify(JSON.stringify(data)));
  }
  //console.log('DATA', toString(data));
  //console.log('FROM PAGE', displayName, slug);
  return (
    <StyledMain>
      {process.env['GATSBY_ENABLE_DARK_MODE'] !== 'true' && <ChatbotUi template="errorpage" />}
      {typeof window !== 'undefined' && (
        <Breadcrumbs siteTitle={siteTitle} slug={slug} defParentPaths={parentPaths} defQueriedCrumbs={queriedCrumbs} />
      )}
      <FeatureNotAvailContainer>
        <FeatureNotAvailImage />
        <ContentContainer />
      </FeatureNotAvailContainer>
    </StyledMain>
  );
};

export default FeatureNotAvailable;
