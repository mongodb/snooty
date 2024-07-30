import React from 'react';
import { withPrefix } from 'gatsby';
import { css, cx } from '@leafygreen-ui/emotion';
import styled from '@emotion/styled';
import Button from '@leafygreen-ui/button';
import { H2 } from '@leafygreen-ui/typography';
import { theme } from '../theme/docsTheme';
import { baseUrl } from '../utils/base-url';
import ChatbotUi from '../components/ChatbotUi';

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

const ContentContainer = () => {
  return (
    <ContentBox>
      <H2 className={cx(titleStyling)}>We're sorry, this page isn't available in the version you selected.</H2>
      <LinkContainer>
        <Button href={baseUrl()} variant="default">
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
  return (
    <main>
      {process.env['GATSBY_ENABLE_DARK_MODE'] !== 'true' && <ChatbotUi template="errorpage" />}
      <FeatureNotAvailContainer>
        <FeatureNotAvailImage />
        <ContentContainer />
      </FeatureNotAvailContainer>
    </main>
  );
};

export default FeatureNotAvailable;
