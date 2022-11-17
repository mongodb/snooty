import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { SideNavItem } from '@leafygreen-ui/side-nav';
import { sideNavItemBasePadding, sideNavItemFontSize } from './styles/sideNavItem';
import Link from '../Link';
import { formatText } from '../../utils/format-text';

const GuidesLandingTree = ({ chapters, handleClick }) => {
  const processedNavItems = useMemo(() => {
    const overviewHeading = { title: 'Overview', to: '/' };
    const chapterHeadings = [overviewHeading];
    const chaptersArr = Object.entries(chapters || {});
    // Clicking on the chapter title in the side nav should bring user to the first
    // guide of that chapter.
    chaptersArr.forEach(([title, data]) => {
      chapterHeadings.push({ title, to: data?.guides[0] });
    });
    return chapterHeadings;
  }, [chapters]);

  return (
    <>
      {processedNavItems.map(({ title, to }) => (
        <SideNavItem
          active={to === '/'}
          as={Link}
          css={[sideNavItemBasePadding, sideNavItemFontSize]}
          key={to}
          onClick={handleClick}
          to={to}
        >
          {formatText(title)}
        </SideNavItem>
      ))}
    </>
  );
};

GuidesLandingTree.propTypes = {
  chapters: PropTypes.object.isRequired,
  handleClick: PropTypes.func,
};

export default GuidesLandingTree;
