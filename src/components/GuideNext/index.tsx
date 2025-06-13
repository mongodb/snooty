import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { palette } from '@leafygreen-ui/palette';
import styled from '@emotion/styled';
import { theme } from '../../theme/docsTheme';
import Content from './Content';
import ChapterInfo from './ChapterInfo';
import { ReadGuidesContextProvider } from './read-guides-context';

const Container = styled('div')`
  border-top: 1px solid ${palette.gray.light2};
  margin-bottom: 24px;
  padding-top: 56px;

  @media ${theme.screenSize.largeAndUp} {
    align-items: center;
    display: flex;
    gap: 0 34px;
  }
`;

const getTargetGuide = (targetGuideIdx, targetChapter, chapters, guides) => {
  const targetChapterName = targetChapter[0];
  const guidesInTargetChapter = chapters[targetChapterName].guides;
  const targetGuideSlug = guidesInTargetChapter[targetGuideIdx];
  return [targetGuideSlug, guides[targetGuideSlug]];
};

const getNextGuideData = (chapters, guides, slug) => {
  // Get current chapter name and guides in said chapter
  const currentChapterName = guides?.[slug]?.['chapter_name'];
  const currentChapter = chapters?.[currentChapterName];
  const guidesInChapter = currentChapter?.guides;

  // Error check in case of malformed data
  if (!(currentChapter && guidesInChapter?.length > 0)) {
    return {
      targetGuide: null,
      targetChapter: null,
    };
  }

  // Determine if final guide in chapter
  const currentGuideIdx = guidesInChapter.indexOf(slug);
  const isFinalGuideInChapter = currentGuideIdx === guidesInChapter.length - 1;
  const targetGuideIdx = isFinalGuideInChapter ? 0 : currentGuideIdx + 1;

  const chaptersArray = Object.entries(chapters);
  const currentChapterNumber = currentChapter?.chapter_number;
  const isFinalChapter = currentChapterNumber === chaptersArray.length;

  let targetChapter = [currentChapterName, currentChapter];
  if (!isFinalChapter && isFinalGuideInChapter) {
    targetChapter = chaptersArray.find((chapter) => {
      const data = chapter[1];
      return data.chapter_number === currentChapterNumber + 1;
    });
  }

  const isFinalGuideOnSite = isFinalChapter && isFinalGuideInChapter;
  let targetGuide = [null, null];
  if (!isFinalGuideOnSite) {
    targetGuide = getTargetGuide(targetGuideIdx, targetChapter, chapters, guides);
  }

  return {
    targetGuide,
    targetChapter,
  };
};

const GuideNext = ({ nodeData: { argument, children }, metadata, slug }) => {
  const { chapters, guides } = metadata;
  const { targetGuide, targetChapter } = useMemo(
    () => getNextGuideData(chapters, guides, slug),
    [chapters, guides, slug]
  );

  if (!(targetGuide && targetChapter)) {
    return null;
  }

  return (
    <ReadGuidesContextProvider slug={slug}>
      <Container>
        <Content argument={argument} children={children} guideData={targetGuide} />
        <ChapterInfo chapterData={targetChapter} guidesMetadata={guides} targetSlug={targetGuide?.[0]} />
      </Container>
    </ReadGuidesContextProvider>
  );
};

GuideNext.propTypes = {
  metadata: PropTypes.shape({
    chapters: PropTypes.object.isRequired,
    guides: PropTypes.object.isRequired,
  }).isRequired,
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object).isRequired,
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  slug: PropTypes.string.isRequired,
};

export default GuideNext;
