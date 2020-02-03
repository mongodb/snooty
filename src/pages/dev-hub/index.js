import React from 'react';
import styled from '@emotion/styled';
import Layout from '../../components/dev-hub/layout';
import { H1, H2, P } from '../../components/dev-hub/text';
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
        <H1>sample code</H1>
        <P>description text</P>
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
          <H2>Developer Inspo</H2>
          <P>description text</P>
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
          <H2>Let's do it live</H2>
          <P>description text</P>
          <div>
            <a>primary link</a>
          </div>
        </header>
      </FeatureSection>
      <FeatureSection>
        <header>
          <H2>Get Involved</H2>
          <P>description text</P>
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
