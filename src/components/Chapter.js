import React, { useMemo } from 'react';
import { withPrefix } from 'gatsby';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import Link from './Link';
import { getPlaintext } from '../utils/get-plaintext';

// Height and width of iamge
const IMAGE_SIZE = 200;

const Container = styled('div')`
  background-color: ${uiColors.white};
  border-radius: 4px;
  border: 1px solid ${uiColors.gray.light3};
  display: grid;
  grid-template-areas:
    'description image'
    'guides guides';
  margin: 8px 0;
  max-width: 743px;
  padding: 48px 56px;
`;

const ImageContainer = styled('img')`
  grid-area: image;
  margin-left: 108px;
`;

const DescriptionContainer = styled('div')`
  display: flex;
  flex-direction: column;
  grid-area: description;
  justify-content: center;
`;

const ChapterNumberLabel = styled('div')`
  background-color: ${uiColors.green.light3};
  border-radius: 4px;
  color: ${uiColors.green.base};
  font-size: 14px;
  font-weight: bold;
  height: 25px;
  text-align: center;
  width: 83px;
`;

const ChapterTitle = styled('div')`
  font-size: 18px;
  font-weight: bold;
  margin-top: 8px;
`;

const ChapterDescription = styled('div')`
  margin-top: 8px;
`;

const GuidesList = styled('ul')`
  grid-area: guides;
  list-style-type: none;
  list-style-image: url(${withPrefix('assets/lightning-bolt.svg')});
  margin-top: 24px;
  margin-bottom: 0;
  padding-inline-start: 14px;
`;

const GuidesListItem = styled('li')`
  padding-top: 4px;
  padding-bottom: 4px;
`;

const GuideLink = styled(Link)`
  align-items: center;
  display: flex;
  color: unset;
  justify-content: space-between;
  position: relative;

  :hover {
    color: unset;
  }
`;

// Uses guides metadata to obtain the title and completion time of each guide in the chapter
const getGuidesData = (metadata, chapterTitle) => {
  const guidePaths = metadata?.chapters[chapterTitle]?.guides;
  let guides = [];

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

const Chapter = ({ metadata, nodeData: { argument, options } }) => {
  const description = options?.description;
  const image = options?.image;
  const chapterTitle = getPlaintext(argument);
  const chapterNumber = metadata?.chapters?.[chapterTitle]?.chapter_number;
  const guides = useMemo(() => getGuidesData(metadata, chapterTitle), [metadata, chapterTitle]);

  return (
    <Container>
      <DescriptionContainer>
        <ChapterNumberLabel>Chapter {chapterNumber}</ChapterNumberLabel>
        <ChapterTitle>{chapterTitle}</ChapterTitle>
        <ChapterDescription>{description}</ChapterDescription>
      </DescriptionContainer>
      {image && (
        <ImageContainer src={withPrefix(image)} altText="Chapter image" height={IMAGE_SIZE} width={IMAGE_SIZE} />
      )}
      <GuidesList>
        {guides.map((guide) => {
          const time = guide.time ? `${guide.time} mins` : '';
          const guideTitle = getPlaintext(guide.title);

          return (
            <GuidesListItem>
              <GuideLink to={guide.path}>
                <span>{guideTitle}</span>
                <span>{time}</span>
              </GuideLink>
            </GuidesListItem>
          );
        })}
      </GuidesList>
    </Container>
  );
};

export default Chapter;
