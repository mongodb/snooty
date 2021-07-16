import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@leafygreen-ui/emotion';
import { SideNavItem } from '@leafygreen-ui/side-nav';
import Link from './Link';
import { formatText } from '../utils/format-text';

const isCurrentPage = (currentUrl, slug) => {
  const trimSlashes = (str) => str.replace(/^\/|\/$/g, '');
  if (!currentUrl || !slug) return false;
  return trimSlashes(currentUrl) === trimSlashes(slug);
};

const tocStyling = css`
  border-left: none;
  padding-top: 8px;
  padding-bottom: 8px;

  // TODO: Remove after mongodb-docs.css is removed
  :hover,
  :focus {
    color: unset;
  }
`;

const tocDrawer = css`
  background-color: unset !important;
  cursor: pointer !important;
`;

const Drawer = ({ children, ...props }) => {
  const [expand, setExpand] = useState(false);

  const handleClickExpand = useCallback(() => {
    setExpand((curr) => !curr);
  }, [setExpand]);

  return (
    <SideNavItem className={cx(tocStyling, tocDrawer)} active={expand} onClick={handleClickExpand} {...props}>
      {children}
    </SideNavItem>
  );
};

// LG's SideNavItem component only renders nested list items correctly if the component has a displayName
// of SideNavItem or SideNavGroup. This is kind of a hacky workaround since we want to use a SideNavItem as
// a drawer instead of a SideNavGroup.
Drawer.displayName = 'SideNavGroup';

// Use a recursive function instead of a recursive component since LG's SideNavItem is reliant on the
// "SideNavItem" displayName
const recurse = ({ currentSlug, node: { children, options, title, slug, url }, ...props }) => {
  const isActive = isCurrentPage(currentSlug, slug);
  const label = formatText(title);
  const target = slug || url;
  const childNodes = children.map((c) => recurse({ currentSlug, node: c, ...props }));

  if (children?.length > 0 && options?.drawer) {
    return (
      <Drawer key={`drawer-${target}`}>
        {label}
        {childNodes}
      </Drawer>
    );
  }

  return (
    <SideNavItem key={`node-${target}`} className={cx(tocStyling)} active={isActive} as={Link} to={target} {...props}>
      {label}
      {childNodes}
    </SideNavItem>
  );
};

const Toctree = ({ slug, toctree: { children } }) => {
  return <>{children.map((c) => recurse({ currentSlug: slug, node: c }))}</>;
};

Toctree.propTypes = {
  toctree: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.string]).isRequired,
        slug: PropTypes.string,
        url: PropTypes.string,
        children: PropTypes.array.isRequired,
        options: PropTypes.shape({
          drawer: PropTypes.bool,
          styles: PropTypes.objectOf(PropTypes.string),
        }),
      })
    ),
  }),
};

export default Toctree;
