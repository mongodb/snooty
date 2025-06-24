import React, { useMemo } from 'react';
import { withPrefix } from 'gatsby';
import styled from '@emotion/styled';
import Card from '@leafygreen-ui/card';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { Body } from '@leafygreen-ui/typography';
import { isString } from 'lodash';
import { theme } from '../../theme/docsTheme';
import Link from '../Link';
import { getPlaintext } from '../../utils/get-plaintext';
import { MetadataChapter, RemoteMetadata } from '../../types/data';
import { ASTNode, ChapterNode } from '../../types/ast';
import ChapterNumberLabel from './ChapterNumberLabel';

// Height and width of image
const IMAGE_SIZE = 200;

const cardStyling = css`
  border: 1px solid;
  background-color: ${palette.white};
  border-color: ${palette.gray.light3};
  .dark-theme & {
    background-color: ${palette.black};
    border-color: ${palette.gray.dark2};
  }
  padding: ${theme.size.large} ${theme.size.medium};

  @media ${theme.screenSize.mediumAndUp} {
    display: grid;
    grid-template-areas:
      'description image'
      'guides guides';
    padding: 48px 40px;
    grid-column-gap: ${theme.size.large};
  }

  @media ${theme.screenSize.largeAndUp} {
    grid-column-gap: 40px;
    scroll-margin-top: 180px;
  }

  @media ${theme.screenSize['2XLargeAndUp']} {
    grid-column-gap: 50px;
  }

  @media ${theme.screenSize['3XLargeAndUp']} {
    grid-column-gap: 108px;
  }
`;

const ChapterImage = styled('img')`
  display: block;
  margin: 0 auto ${theme.size.medium} auto;
  height: auto;
  max-width: 100%;

  @media ${theme.screenSize.mediumAndUp} {
    grid-area: image;
    margin-bottom: 0;
  }
`;

// Reserves enough space for chapters without images, while keeping existing images for chapters responsive
const EmptyImage = styled('div')`
  height: auto;
  width: ${IMAGE_SIZE}px;

  @media ${theme.screenSize.mediumAndUp} {
    grid-area: image;
  }
`;

const DescriptionContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media ${theme.screenSize.mediumAndUp} {
    grid-area: description;
  }
`;

const ChapterTitle = styled('div')`
  font-size: 18px;
  font-weight: 500;
  margin-top: ${theme.size.small};
  .dark-theme & {
    color: ${palette.white};
  }
`;

const decriptionStyling = css`
  margin-top: ${theme.size.small};
  .dark-theme & {
    color: ${palette.gray.light2};
  }
`;

const GuidesList = styled('ul')`
  list-style-type: none;
  list-style-image: url(${withPrefix('assets/lightning-bolt.svg')});
  .dark-theme & {
    list-style-image: url(${withPrefix('assets/lightning-bolt-dark.svg')});
  }
  margin-bottom: 0;
  margin-top: ${theme.size.medium};
  padding-inline-start: 14px;

  @media ${theme.screenSize.mediumAndUp} {
    grid-area: guides;
  }
`;

const GuideLink = styled(Link)`
  border-radius: ${theme.size.tiny};
  display: flex;
  color: unset;
  font-weight: inherit;
  .dark-theme & {
    color: ${palette.gray.light1};
  }
  flex-direction: column;
  padding: ${theme.size.small};
  position: relative;
  font-size: ${theme.size.default};
  line-height: ${theme.size.medium};

  :hover {
    background-color: ${palette.gray.light2};
    .dark-theme & {
      background-color: ${palette.gray.dark3};
      text-decoration: none;
    }
    ::after {
      content: none;
    }
  }

  @media ${theme.screenSize.mediumAndUp} {
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    padding: ${theme.size.tiny} ${theme.size.small};
  }
`;

type GuideData = {
  path: string;
  time?: number;
  title?: string | ASTNode[];
};

// Uses guides metadata to obtain the title and completion time of each guide in the chapter
const getGuidesData = (metadata: RemoteMetadata, currentChapter?: MetadataChapter) => {
  const guidePaths = currentChapter?.guides;
  let guides: GuideData[] = [];

  if (guidePaths) {
    guidePaths.forEach((guidePath) => {
      const guide = metadata?.guides?.[guidePath];
      guides.push({
        path: guidePath,
        time: guide?.completion_time,
        title: guide?.title,
      });
    });
  }

  return guides;
};

export type ChapterProps = {
  metadata: RemoteMetadata;
  nodeData: ChapterNode;
};

const Chapter = ({ metadata, nodeData: { argument, options } }: ChapterProps) => {
  const description = options?.description;
  const image = options?.image;
  const chapterTitle = getPlaintext(argument);
  const currentChapter = metadata?.chapters?.[chapterTitle];
  const chapterNumber = currentChapter?.chapter_number;
  const guides = useMemo(() => getGuidesData(metadata, currentChapter), [metadata, currentChapter]);

  return (
    // TODO: have to return specific typography here. card is explicit size 13 font

    <Card className={cx(cardStyling)} id={currentChapter?.id}>
      {image ? (
        <ChapterImage
          src={withPrefix(image)}
          height={IMAGE_SIZE}
          width={IMAGE_SIZE}
          alt={`Chapter image for ${chapterTitle}`}
        />
      ) : (
        <EmptyImage />
      )}
      <DescriptionContainer>
        <ChapterNumberLabel number={chapterNumber ?? 1} />
        <ChapterTitle>{chapterTitle}</ChapterTitle>
        <Body className={cx(decriptionStyling)}>{description}</Body>
      </DescriptionContainer>
      <GuidesList>
        {guides.map((guide, i) => {
          const time = guide.time ? `${guide.time} mins` : '';
          const guideTitle = isString(guide.title) ? guide.title : getPlaintext(guide.title ?? []);

          return (
            <li key={`${guideTitle}-${i}`}>
              <GuideLink to={guide.path}>
                <span>{guideTitle}</span>
                <span>{time}</span>
              </GuideLink>
            </li>
          );
        })}
      </GuidesList>
    </Card>
  );
};

export default Chapter;
