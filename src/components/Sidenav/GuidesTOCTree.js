import React, { useContext } from 'react';
import { cx } from '@leafygreen-ui/emotion';
import { SideNavItem } from '@leafygreen-ui/side-nav';
import { sideNavItemTOCStyling } from './styles/sideNavItem';
import Link from '../Link';
import { ContentsContext } from '../contents-context';
import { formatText } from '../../utils/format-text';
import { getPlaintext } from '../../utils/get-plaintext';
import { isCurrentPage } from '../../utils/is-current-page';

const GuidesTOCTree = ({ chapters, guides, slug }) => {
  const currentChapterName = guides?.[slug]?.['chapter_name'];
  const guidesInChapter = chapters?.[currentChapterName]?.guides;
  const { activeHeadingId, headingNodes } = useContext(ContentsContext);

  return (
    <>
      {guidesInChapter?.length > 0 &&
        guidesInChapter.map((guide) => {
          const guideName = getPlaintext(guides[guide].title);
          const isActiveGuide = isCurrentPage(slug, guide);

          return (
            <React.Fragment key={guide}>
              <SideNavItem
                active={isActiveGuide && !activeHeadingId}
                as={Link}
                className={cx(sideNavItemTOCStyling({ level: 1 }))}
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
