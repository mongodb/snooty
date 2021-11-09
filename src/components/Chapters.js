import React, { useState, useContext, useMemo } from 'react';
import { withPrefix } from 'gatsby';
import PropTypes from 'prop-types';
import Icon from '@leafygreen-ui/icon';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import LeafyGreenCard from '@leafygreen-ui/card';
import { uiColors } from '@leafygreen-ui/palette';
import ComponentFactory from './ComponentFactory';
import CardGroup from './CardGroup';
import BookIcon from './icons/Book';
import Link from './Link';
import { SidenavContext } from './Sidenav';
import { theme } from '../theme/docsTheme';
import { getPlaintext } from '../utils/get-plaintext';

const Container = styled('div')`
  background-color: ${uiColors.gray.light3};
  padding: ${theme.size.medium};

  @media ${theme.screenSize.mediumAndUp} {
    padding: 40px 48px;
  }

  @media ${theme.screenSize.largeAndUp} {
    padding: 40px ${theme.size.xlarge};
  }
`;

// Additional div to allow the Container to stretch across the page, while keeping
// the actual content of the Chapters component constrained.
const Content = styled('div')`
  margin: 0 auto;
  max-width: 1200px;
`;

const ViewController = styled('div')`
  display: flex;
  gap: 0 ${theme.size.medium};
  flex-wrap: wrap;
  margin-bottom: 40px;
`;

const ViewOption = styled('span')`
  align-items: center;
  color: ${({ isActive }) => (isActive ? uiColors.black : uiColors.gray.base)};
  cursor: pointer;
  display: flex;

  > svg {
    margin-right: ${theme.size.small};
  }

  :hover {
    color: ${uiColors.black};
  }
`;

const LeftColumn = styled('div')`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.default} 0;
`;

const RightColumn = styled('div')`
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

const ChapterView = styled('div')`
  @media ${theme.screenSize.largeAndUp} {
    display: flex;
    gap: 0 40px;
  }

  @media ${theme.screenSize['2XLargeAndUp']} {
    gap: 0 108px;
  }
`;

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

// Guides cards have a slightly different style than the rest of our cards. It might be worth
// adding a new Card style in the future.
// Using css instead of styled to avoid errors while testing
const guidesCardsStyle = css`
  p {
    font-weight: normal;

    > a {
      color: ${uiColors.black};

      :hover {
        color: ${uiColors.black};
      }
    }
  }
`;

// Emulate the nodeData structure for our Card component
const getGuidesData = (guides) => {
  const guidesArray = Object.entries(guides);
  return guidesArray.map((guide) => {
    const [slug, data] = guide;

    return {
      type: 'directive',
      name: 'card',
      children: data['description'],
      options: {
        cta: data['completion_time'] ? `${data['completion_time']} mins` : '',
        headline: getPlaintext(data['title']),
        icon: 'assets/green-lightning-bolt.svg',
        'icon-alt': 'Guides card icon',
        url: withPrefix(slug),
      },
    };
  });
};

// Emulate the nodeData structure for our CardGroup component
const getGuidesViewData = (guides) => {
  if (!guides) return null;
  return {
    children: getGuidesData(guides),
    options: {
      columns: 3,
    },
  };
};

const Views = {
  Chapter: {
    name: 'Chapter',
    icon: <BookIcon />,
  },
  Gallery: {
    name: 'Gallery',
    icon: <Icon glyph="Apps" />,
  },
};

const Chapters = ({ metadata, nodeData: { children } }) => {
  const { isCollapsed } = useContext(SidenavContext);
  const [view, setView] = useState(Views.Chapter.name);
  const galleryViewData = useMemo(() => getGuidesViewData(metadata?.guides), [metadata]);

  return (
    <Container className="chapters">
      <Content>
        <ViewController>
          {Object.values(Views).map((viewOption) => (
            <ViewOption
              key={viewOption.name}
              isActive={view === viewOption.name}
              onClick={() => setView(viewOption.name)}
            >
              {viewOption.icon}
              {viewOption.name} View
            </ViewOption>
          ))}
        </ViewController>
        {view === Views.Chapter.name && (
          <ChapterView>
            <RightColumn isSidenavCollapsed={isCollapsed}>
              <LearningCard>
                <LearningTitle>Still Learning MongoDB?</LearningTitle>
                <p>Explore these resources to learn some fundamental MongoDB concepts.</p>
                <StyledLink to="">
                  <Icon glyph="Play" />
                  Watch MongoDB in 60 seconds →
                </StyledLink>
                <StyledLink to="https://university.mongodb.com/courses/M001/about">
                  <Icon glyph="University" />
                  Take M001 MongoDB Basics →
                </StyledLink>
              </LearningCard>
            </RightColumn>
            <LeftColumn>
              {children.map((child, i) => (
                <ComponentFactory key={i} metadata={metadata} nodeData={child} />
              ))}
            </LeftColumn>
          </ChapterView>
        )}
        {view === Views.Gallery.name && <CardGroup css={guidesCardsStyle} nodeData={galleryViewData} />}
      </Content>
    </Container>
  );
};

Chapters.propTypes = {
  metadata: PropTypes.object.isRequired,
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Chapters;
