import React from 'react';
import styled from '@emotion/styled';
import Layout from '../../components/dev-hub/layout';
import { colorMap, size } from '../../components/dev-hub/theme';

const LiveStream = styled('div')`
  background: ${colorMap.greyDarkTwo};
  border-radius: ${size.large};
  padding: ${size.default};
  text-align: center;
`;

const Hero = styled('header')`
  color: ${colorMap.devWhite};
  min-height: 40vh;
  padding: ${size.large} 0;
  text-align: center;
`;

const ArticleGallery = styled('section')`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${size.large} 0;
`;

const ArticleGalleryCards = styled('div')`
  display: flex;
  justify-content: flex-start;
  overflow-x: auto;
  margin-bottom: ${size.default};
  width: 100%;
`;

const ArticleGalleryCard = styled('a')`
  background: ${colorMap.devWhite};
  flex: 0 0 288px;
  height: 400px;
  margin-right: ${size.large};
`;

const FeatureSection = styled('section')`
  display: flex;
  justify-content: space-between;
  padding: ${size.large} 0;
  header {
    flex: 1;
  }
`;

const FeatureSectionCard = styled('a')`
  background: ${colorMap.devWhite};
  display: block;
  height: 408px;
  width: 368px;
`;

const FeatureSectionVideo = styled('a')`
  background: ${colorMap.devWhite};
  display: block;
  height: 408px;
  width: 65%;
`;

export default ({ ...data }) => {
  console.log(data);
  return (
    <Layout>
      <LiveStream>Live now</LiveStream>
      <Hero>
        <h1>
          <pre>sample code</pre>
        </h1>
        <p>description text</p>
        <div>
          <a>primary link</a>
          <a>secondary link</a>
        </div>
      </Hero>
      <ArticleGallery>
        <ArticleGalleryCards>
          <ArticleGalleryCard>Card</ArticleGalleryCard>
          <ArticleGalleryCard>Card</ArticleGalleryCard>
          <ArticleGalleryCard>Card</ArticleGalleryCard>
          <ArticleGalleryCard>Card</ArticleGalleryCard>
          <ArticleGalleryCard>Card</ArticleGalleryCard>
          <ArticleGalleryCard>Card</ArticleGalleryCard>
        </ArticleGalleryCards>
        <a>secondary link</a>
      </ArticleGallery>
      <FeatureSection>
        <header>
          <h2>Developer Inspo</h2>
          <p>description text</p>
          <div>
            <a>primary link</a>
            <a>tertiary link</a>
          </div>
        </header>
        <FeatureSectionCard>Card</FeatureSectionCard>
      </FeatureSection>
      <FeatureSection>
        <FeatureSectionVideo>Video</FeatureSectionVideo>
        <header>
          <h2>Let's do it live</h2>
          <p>description text</p>
          <div>
            <a>primary link</a>
          </div>
        </header>
      </FeatureSection>
      <FeatureSection>
        <header>
          <h2>Get Involved</h2>
          <p>description text</p>
          <div>
            <a>primary link</a>
            <a>tertiary link</a>
          </div>
        </header>
        <FeatureSectionCard>Card</FeatureSectionCard>
      </FeatureSection>
    </Layout>
  );
};
