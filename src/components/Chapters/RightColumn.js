import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import LeafyGreenCard from '@leafygreen-ui/card';
import { css, cx } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import { uiColors } from '@leafygreen-ui/palette';
import ContentsList from '../ContentsList/ContentsList';
import ContentsListItem from '../ContentsList/ContentsListItem';
import Link from '../Link';
import { SidenavContext } from '../Sidenav';
import useActiveHeading from '../../hooks/useActiveHeading';
import useVisibleOnScroll from '../../hooks/useVisibleOnScroll';
import { theme } from '../../theme/docsTheme';

const learningCardStyle = ({ isVisible }) => css`
  background-color: ${uiColors.white};
  display: flex;
  flex-direction: column;
  padding: ${theme.size.large};
  border-radius: ${theme.size.tiny};
  margin-bottom: ${theme.size.default};

  > p {
    margin-bottom: ${theme.size.default};
  }

  @media ${theme.screenSize.mediumAndUp} {
    padding: 40px ${theme.size.large};
  }

  @media ${theme.screenSize.largeAndUp} {
    ${!isVisible &&
    `
      opacity: 0;
      pointer-events: none;
    `}
    transition: opacity 200ms ease-in-out;
  }
`;

const Container = styled('div')`
  display: none;

  @media ${theme.screenSize.mediumAndUp} {
    display: initial;
  }

  @media ${theme.screenSize.largeAndUp} {
    order: 2;
    max-width: 340px;
    ${({ isSidenavCollapsed }) => !isSidenavCollapsed && 'display: none;'}
  }

  @media ${theme.screenSize.xLargeAndUp} {
    display: initial;
  }
`;

const Sticky = styled('div')`
  @media ${theme.screenSize.largeAndUp} {
    position: sticky;
    top: 220px;
  }
`;

const StyledLink = styled(Link)`
  display: flex;
  gap: 0 ${theme.size.small};
  margin-top: ${theme.size.small};

  svg {
    margin-top: ${theme.size.tiny};
  }

  @media ${theme.screenSize.largeAndUp} {
    margin-top: ${theme.size.default};
  }
`;

const ListContainer = styled('div')`
  display: none;

  @media ${theme.screenSize.largeAndUp} {
    display: block;
    margin-bottom: 56px;
  }
`;

const LearningTitle = styled('div')`
  font-size: ${theme.fontSize.h3};
  margin-bottom: ${theme.size.small};
`;

const RightColumn = ({ chapters = {} }) => {
  const { isCollapsed } = useContext(SidenavContext);
  // Have children of the RightColumn appear as user scrolls past hero image on large screen sizes
  const isVisible = useVisibleOnScroll('.hero-img');
  const chapterEntries = Object.entries(chapters || {});
  const chapterValues = Object.values(chapters || {});
  const activeChapterId = useActiveHeading(chapterValues);

  return (
    <Container isSidenavCollapsed={isCollapsed} isVisible={isVisible}>
      <Sticky>
        <ListContainer>
          <ContentsList label="Chapters">
            {chapterEntries.map((entry) => {
              const [chapterName, chapterData] = entry;
              const chapterId = chapterData.id;
              return (
                <ContentsListItem key={chapterId} id={chapterId} isActive={chapterId === activeChapterId}>
                  {chapterName}
                </ContentsListItem>
              );
            })}
          </ContentsList>
        </ListContainer>
        <LeafyGreenCard className={cx(learningCardStyle({ isVisible }))}>
          <LearningTitle>Still Learning MongoDB?</LearningTitle>
          <p>Explore these resources to learn some fundamental MongoDB concepts.</p>
          <StyledLink to="https://university.mongodb.com/courses/M001/about">
            <Icon glyph="University" />
            Take M001 MongoDB Basics →
          </StyledLink>
        </LeafyGreenCard>
      </Sticky>
    </Container>
  );
};

RightColumn.propTypes = {
  chapters: PropTypes.object.isRequired,
};

export default RightColumn;
