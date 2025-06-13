import React from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import Card from '@leafygreen-ui/card';
import styled from '@emotion/styled';
import ChapterNumberLabel from '../Chapters/ChapterNumberLabel';
import { theme } from '../../theme/docsTheme';
import GuidesList from './GuidesList';

const cardStyling = css`
  margin-top: 40px;
  padding: 40px ${theme.size.medium};

  @media ${theme.screenSize.mediumAndUp} {
    padding: 48px;
  }

  @media ${theme.screenSize.largeAndUp} {
    flex-basis: 0;
    flex-grow: 1;
    min-width: 300px;
    margin-top: 0;
    max-width: 510px;
  }
  background-color: ${palette.white};
  border-color: ${palette.gray.light2};
  .dark-theme & {
    background-color: ${palette.gray.dark4};
    border-color: ${palette.gray.dark3};
  }
`;

const TopWrapper = styled('div')`
  margin-bottom: ${theme.size.medium};

  @media ${theme.screenSize.mediumAndUp} {
    display: flex;
    gap: 0 ${theme.size.default};
    margin-bottom: 34px;
  }
`;

const StyledChapterNumberLabel = styled(ChapterNumberLabel)`
  margin-bottom: ${theme.size.small};
`;

const ChapterTitle = styled('div')`
  color: ${palette.black};
  .dark-theme & {
    color: ${palette.gray.light2};
  }
  font-weight: bold;
`;

interface ChapterData {
  chapter_number: number;
  guides: Array<string>;
}

interface ChapterInfoProps {
  chapterData: [title: string, ChapterData];
  guidesMetadata: Record<string, { title: string }>;
  targetSlug: string;
}

const ChapterInfo = ({ chapterData, guidesMetadata, targetSlug }: ChapterInfoProps) => {
  if (chapterData?.length < 2) {
    return null;
  }

  const [title, data] = chapterData;

  return (
    <Card className={cx(cardStyling)}>
      <TopWrapper>
        <StyledChapterNumberLabel number={data.chapter_number} />
        <ChapterTitle>{title}</ChapterTitle>
      </TopWrapper>
      <GuidesList guidesMetadata={guidesMetadata} guideSlugs={data.guides} targetSlug={targetSlug} />
    </Card>
  );
};

ChapterInfo.propTypes = {
  chapterData: PropTypes.array.isRequired,
  guidesMetadata: PropTypes.object.isRequired,
  targetSlug: PropTypes.string,
};

export default ChapterInfo;
