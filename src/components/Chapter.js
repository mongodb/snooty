import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import Link from './Link';
import { theme } from '../theme/docsTheme';
import { getPlaintext } from '../utils/get-plaintext';

// Height and width of image
const IMAGE_SIZE = 200;

const Container = styled('div')`
  background-color: ${uiColors.white};
  border-radius: ${theme.size.tiny};
  border: 1px solid ${uiColors.gray.light3};
  margin: ${theme.size.small} 0;
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
  grid-area: image;
  height: auto;
  width: 200px;
`;

const DescriptionContainer = styled('div')`
  display: flex;
  flex-direction: column;
  grid-area: description;
  justify-content: center;

  @media ${theme.screenSize.mediumAndUp} {
    grid-area: description;
  }
`;

const ChapterNumberLabel = styled('div')`
  background-color: ${uiColors.green.light3};
  border-radius: ${theme.size.tiny};
  color: ${uiColors.green.base};
  font-size: 14px;
  font-weight: bold;
  height: ${theme.size.medium};
  text-align: center;
  width: 83px;
`;

const ChapterTitle = styled('div')`
  font-size: 18px;
  font-weight: bold;
  margin-top: ${theme.size.small};
`;

const ChapterDescription = styled('div')`
  margin-top: ${theme.size.small};
`;

const GuidesList = styled('ul')`
  list-style-type: none;
  list-style-image: url(${withPrefix('assets/lightning-bolt.svg')});
  margin-bottom: 0;
  margin-top: ${theme.size.medium};
  padding-inline-start: 14px;

  @media ${theme.screenSize.mediumAndUp} {
    grid-area: guides;
  }
`;

const GuidesListItem = styled('li')`
  padding: 0 ${theme.size.small};

  @media ${theme.screenSize.mediumAndUp} {
    padding: 0 ${theme.size.tiny};
  }
`;

const GuideLink = styled(Link)`
  display: flex;
  color: unset;
  flex-direction: column;
  position: relative;

  :hover {
    color: unset;
    text-decoration: none;
  }

  @media ${theme.screenSize.mediumAndUp} {
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
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
      {image ? (
        <ChapterImage
          src={withPrefix(image)}
          height={IMAGE_SIZE}
          width={IMAGE_SIZE}
          altText={`Chapter image for ${chapterTitle}`}
        />
      ) : (
        <EmptyImage />
      )}
      <DescriptionContainer>
        <ChapterNumberLabel>Chapter {chapterNumber}</ChapterNumberLabel>
        <ChapterTitle>{chapterTitle}</ChapterTitle>
        <ChapterDescription>{description}</ChapterDescription>
      </DescriptionContainer>
      <GuidesList>
        {guides.map((guide, i) => {
          const time = guide.time ? `${guide.time} mins` : '';
          const guideTitle = getPlaintext(guide.title);

          return (
            <GuidesListItem key={`${guideTitle}-${i}`}>
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

Chapter.propTypes = {
  metadata: PropTypes.shape({
    chapters: PropTypes.object.isRequired,
    guides: PropTypes.object.isRequired,
  }).isRequired,
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object).isRequired,
    options: PropTypes.shape({
      description: PropTypes.string,
      image: PropTypes.string,
    }),
  }).isRequired,
};

export default Chapter;
