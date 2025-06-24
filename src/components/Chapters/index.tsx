import React, { useState, useMemo } from 'react';
import Icon from '@leafygreen-ui/icon';
import { css } from '@leafygreen-ui/emotion';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { isString } from 'lodash';
import ComponentFactory from '../ComponentFactory';
import CardGroup from '../Card/CardGroup';
import BookIcon from '../icons/Book';
import { theme } from '../../theme/docsTheme';
import { assertTrailingSlash } from '../../utils/assert-trailing-slash';
import { getPlaintext } from '../../utils/get-plaintext';
import useStickyTopValues, { StickyTopValues } from '../../hooks/useStickyTopValues';
import { CardGroupNode, CardNode, ChaptersNode } from '../../types/ast';
import { MetadataChapters, MetadataGuides, RemoteMetadata } from '../../types/data';
import RightColumn from './RightColumn';

const plpGridColumns = css`
  display: grid;
  grid-template-columns: minmax(${theme.size.xlarge}, 1fr) minmax(0, 1200px) minmax(${theme.size.xlarge}, 1fr);

  @media ${theme.screenSize.upToLarge} {
    grid-template-columns: 48px 1fr 48px;
  }

  @media ${theme.screenSize.upToMedium} {
    grid-template-columns: ${theme.size.medium} 1fr ${theme.size.medium};
  }
`;

const Container = styled('div')`
  --background-color: ${palette.gray.light3};
  .dark-theme & {
    --background-color: ${palette.black};
  }
  background-color: var(--background-color);
`;

// Additional div to allow the Container to stretch across the page, while keeping
// the actual content of the Chapters component constrained.
const Grid = styled('div')`
  ${plpGridColumns}
`;

const Content = styled('div')`
  grid-column: 2;
  margin-bottom: 70px;
`;

const ViewController = styled('div')<StickyTopValues>`
  background-color: var(--background-color);
  margin-bottom: 20px;
  min-height: 84px;
  position: sticky;
  top: ${({ topSmall }) => topSmall};
  z-index: 1;

  ${plpGridColumns};

  @media ${theme.screenSize.smallAndUp} {
    top: ${({ topMedium }) => topMedium};
  }

  @media ${theme.screenSize.largeAndUp} {
    top: ${({ topLarge }) => topLarge};
  }
`;

const ViewOptions = styled('div')`
  display: flex;
  gap: 0 ${theme.size.medium};
  grid-column: 2;
`;

const ViewOption = styled('span')<{ isActive: boolean }>`
  align-items: center;
  --color-active: ${palette.black};
  .dark-theme & {
    --color-active: ${palette.white};
  }
  color: ${({ isActive }) => (isActive ? `var(--color-active)` : palette.gray.base)};
  cursor: pointer;
  display: flex;

  > svg {
    margin-right: ${theme.size.small};
  }

  :hover {
    color: ${palette.black};
    .dark-theme & {
      color: ${palette.white};
    }
  }
`;

const LeftColumn = styled('div')`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.default} 0;
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

// Guides cards have a slightly different style than the rest of our cards. It might be worth
// adding a new Card style in the future.
// Using css instead of styled to avoid errors while testing
const guidesCardsStyle = css`
  p {
    font-weight: normal;

    > a {
      color: ${palette.black};

      :hover {
        color: ${palette.black};
      }
    }
  }
`;

// Emulate the nodeData structure for our Card component
const getGuidesData = (chapters: MetadataChapters, guides: MetadataGuides): CardNode[] => {
  const guidesArray = Object.entries(guides);
  return guidesArray.map((guide) => {
    const [slug, data] = guide;
    const chapterName = data['chapter_name'];
    const children = isString(data['description'])
      ? [{ type: 'text', value: data['description'] }]
      : data['description'];

    return {
      type: 'directive',
      name: 'card',
      children,
      argument: [],
      options: {
        cta: data['completion_time'] ? `${data['completion_time']} mins` : '',
        headline: isString(data['title']) ? data['title'] : getPlaintext(data['title']),
        icon: chapterName ? chapters[chapterName]?.['icon'] : undefined,
        'icon-alt': `${chapterName} chapter icon`,
        url: assertTrailingSlash(slug),
      },
    };
  });
};

// Emulate the nodeData structure for our CardGroup component
const getGuidesViewData = (metadata: RemoteMetadata): CardGroupNode | null => {
  if (!metadata || !metadata.chapters || !metadata.guides) return null;
  return {
    type: 'directive',
    name: 'card-group',
    argument: [],
    children: getGuidesData(metadata.chapters, metadata.guides),
    options: {
      columns: 3,
      layout: '',
      style: '',
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

export type ChaptersProps = {
  metadata: RemoteMetadata;
  nodeData: ChaptersNode;
};

const Chapters = ({ metadata, nodeData: { children } }: ChaptersProps) => {
  const [view, setView] = useState(Views.Chapter.name);
  const galleryViewData = useMemo(() => getGuidesViewData(metadata), [metadata]);
  const topValues = useStickyTopValues();

  return (
    <Container className="chapters">
      <ViewController {...topValues}>
        <ViewOptions>
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
        </ViewOptions>
      </ViewController>
      <Grid>
        <Content>
          {view === Views.Chapter.name && (
            <ChapterView>
              <RightColumn chapters={metadata?.chapters} />
              <LeftColumn>
                {children.map((child, i) => (
                  <ComponentFactory key={i} metadata={metadata} nodeData={child} />
                ))}
              </LeftColumn>
            </ChapterView>
          )}
          {view === Views.Gallery.name && !!galleryViewData && (
            <CardGroup className={guidesCardsStyle} nodeData={galleryViewData} />
          )}
        </Content>
      </Grid>
    </Container>
  );
};

export default Chapters;
