import React from 'react';
import PropTypes from 'prop-types';
import { SideNavGroup, SideNavItem } from '@leafygreen-ui/side-nav';
import { useLocation } from '@reach/router';
import { formatText } from '../utils/format-text';
import Link from './Link';

const isCurrentPage = (currentUrl, slug) => {
  const trimSlashes = (str) => str.replace(/^\/|\/$/g, '');
  if (!currentUrl || !slug) return false;
  return trimSlashes(currentUrl) === trimSlashes(slug);
};

const recurse = ({ node: { children, options, title, slug, url }, pathname, ...props }) => {
  const isActive = isCurrentPage(pathname, slug);
  const label = formatText(title);
  const target = slug || url;
  if (children && children.length) {
    const childNodes = children.map((c) => recurse({ ...props, pathname, node: c }));
    return (
      <>
        {/* Note: may have to specify initialCollapsed prop for SideNavGroup, but I *think* it should be handled by LeafyGreen */}
        {!!(options && options.drawer) ? (
          <SideNavGroup {...props} header={label} collapsible>
            {childNodes}
          </SideNavGroup>
        ) : (
          <SideNavItem {...props} active={isActive} as={Link} to={target}>
            {label}
            {childNodes}
          </SideNavItem>
        )}
      </>
    );
  }
  return (
    <SideNavItem {...props} active={isActive} as={Link} to={target}>
      {label}
    </SideNavItem>
  );
};

/* const ToctreeNode = ({ active, node, ...props }) => {
  const { children, options, title, slug, url } = node;
  const { pathname } = useLocation();
  const isActive = useMemo(() => active || isCurrentPage(pathname, slug), [active, pathname, slug]);
  const label = formatText(title);
  const target = slug || url;
  const [expanded, setExpanded] = React.useState(false);
  if (children && children.length) {
    if (options.drawer) {
      console.log(pathname, pathname === '/sdk/react-native/fundamentals/realms/');
      return (
        <SideNavItem
          {...props}
          active={pathname === '/sdk/react-native/fundamentals/realms/'}
          onClick={() => setExpanded(!expanded)}
        >
          {label}
          {children.map((c) => (
            <ToctreeNode key={c.slug || c.url} {...props} node={c} active={isCurrentPage(pathname, c.slug)} />
          ))}
        </SideNavItem>
      );
    }

    return (
      <SideNavItem {...props} active={isActive} as={Link} to={target}>
        {label}
        {children.map((c) => (
          <ToctreeNode key={c.slug || c.url} {...props} node={c} active={isCurrentPage(pathname, c.slug)} />
        ))}
      </SideNavItem>
    );
  }
  return (
    <SideNavItem {...props} active={isActive} as={Link} to={target}>
      {label}
    </SideNavItem>
  );
};

ToctreeNode.displayName = 'SideNavItem'; */

const Toctree = ({ toctree: { children } }) => {
  const { pathname } = useLocation();
  return <>{children.map((c) => recurse({ pathname, node: c }))}</>;
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
