import React from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@leafygreen-ui/emotion';
import { uiColors } from '@leafygreen-ui/palette';
import Card from '@leafygreen-ui/card';
import styled from '@emotion/styled';
import GuidesList from './GuidesList';
import ChapterNumberLabel from '../Chapters/ChapterNumberLabel';
import { theme } from '../../theme/docsTheme';

const cardStyling = css`
  padding: 40px ${theme.size.medium};

  @media ${theme.screenSize.mediumAndUp} {
    padding: 48px;
  }

  @media ${theme.screenSize.largeAndUp} {
    flex-basis: 0;
    flex-grow: 1;
    min-width: 300px;
    max-width: 510px;
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
  color: ${uiColors.black};
  font-weight: bold;
`;

const ChapterInfo = ({ chapterData, guidesMetadata, targetSlug }) => {
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
  targetSlug: PropTypes.string.isRequired,
};

export default ChapterInfo;
