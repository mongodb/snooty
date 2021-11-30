import React, { useContext } from 'react';
import styled from '@emotion/styled';
import LeafyGreenCard from '@leafygreen-ui/card';
import Icon from '@leafygreen-ui/icon';
import { uiColors } from '@leafygreen-ui/palette';
import Link from '../../Link';
import { SidenavContext } from '../../Sidenav';
import useVisibleOnScroll from '../../../hooks/useVisibleOnScroll';
import { theme } from '../../../theme/docsTheme';

const LearningCard = styled(LeafyGreenCard)`
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
    ${({ isVisible }) =>
      !isVisible &&
      `
      opacity: 0;
      pointer-events: none;
    `}
    position: sticky;
    top: 220px;
    transition: opacity 200ms ease-in-out;
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

const LearningTitle = styled('div')`
  font-size: ${theme.fontSize.h3};
  margin-bottom: ${theme.size.small};
`;

const RightColumn = () => {
  const { isCollapsed } = useContext(SidenavContext);
  // Have children of the RightColumn appear as user scrolls past hero image on large screen sizes
  const isVisible = useVisibleOnScroll('.hero-img');

  return (
    <Container isSidenavCollapsed={isCollapsed} isVisible={isVisible}>
      <Sticky isVisible={isVisible}>
        <LearningCard>
          <LearningTitle>Still Learning MongoDB?</LearningTitle>
          <p>Explore these resources to learn some fundamental MongoDB concepts.</p>
          <StyledLink to="https://university.mongodb.com/courses/M001/about">
            <Icon glyph="University" />
            Take M001 MongoDB Basics →
          </StyledLink>
        </LearningCard>
      </Sticky>
    </Container>
  );
};

export default RightColumn;
