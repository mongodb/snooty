import React, { useContext } from 'react';
import { cx } from '@leafygreen-ui/emotion';
import { SideNavItem } from '@leafygreen-ui/side-nav';
import { isString } from 'lodash';
import Link from '../Link';
import { ContentsContext } from '../Contents/contents-context';
import { formatText } from '../../utils/format-text';
import { getPlaintext } from '../../utils/get-plaintext';
import { isCurrentPage } from '../../utils/is-current-page';
import { MetadataChapters, MetadataGuides } from '../../types/data';
import { sideNavItemTOCStyling } from './styles/sideNavItem';

export type GuidesTOCTreeProps = {
  chapters: MetadataChapters;
  guides: MetadataGuides;
  handleClick: () => void;
  slug: string;
};

const GuidesTOCTree = ({ chapters, guides, handleClick, slug }: GuidesTOCTreeProps) => {
  const currentChapterName = guides?.[slug]?.['chapter_name'];
  const guidesInChapter: string[] = currentChapterName ? chapters?.[currentChapterName]?.guides ?? [] : [];
  const { activeHeadingId, headingNodes } = useContext(ContentsContext);

  return (
    <>
      {guidesInChapter?.length > 0 &&
        guidesInChapter.map((guide) => {
          const title = guides[guide].title;
          const guideName = isString(title) ? title : getPlaintext(title);
          const isActiveGuide = isCurrentPage(slug, guide);

          return (
            <React.Fragment key={guide}>
              <SideNavItem
                active={isActiveGuide}
                as={Link}
                className={cx(sideNavItemTOCStyling({ level: 1 }))}
                onClick={handleClick}
                to={guide}
              >
                {guideName}
              </SideNavItem>
              {isActiveGuide &&
                headingNodes.map(({ id, title }) => (
                  <SideNavItem
                    active={activeHeadingId === id}
                    as={Link}
                    className={cx(sideNavItemTOCStyling({ level: 2 }))}
                    key={id}
                    onClick={handleClick}
                    to={`#${id}`}
                  >
                    {formatText(title)}
                  </SideNavItem>
                ))}
            </React.Fragment>
          );
        })}
    </>
  );
};

export default GuidesTOCTree;
