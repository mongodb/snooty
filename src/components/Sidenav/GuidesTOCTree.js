import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { cx } from '@leafygreen-ui/emotion';
import { SideNavItem } from '@leafygreen-ui/side-nav';
import Link from '../Link';
import { ContentsContext } from '../Contents/contents-context';
import { formatText } from '../../utils/format-text';
import { getPlaintext } from '../../utils/get-plaintext';
import { isCurrentPage } from '../../utils/is-current-page';
import { sideNavItemTOCStyling } from './styles/sideNavItem';

const GuidesTOCTree = ({ chapters, guides, handleClick, slug }) => {
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

GuidesTOCTree.propTypes = {
  chapters: PropTypes.object.isRequired,
  guides: PropTypes.object.isRequired,
  handleClick: PropTypes.func,
  slug: PropTypes.string.isRequired,
};

export default GuidesTOCTree;
