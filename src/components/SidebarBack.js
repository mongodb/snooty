import React, { useContext } from 'react';
import Icon from '@leafygreen-ui/icon';
import { SideNavItem } from '@leafygreen-ui/side-nav';
import ComponentFactory from './ComponentFactory';
import { NavigationContext } from './navigation-context';

const SidebarBack = () => {
  const { parents } = useContext(NavigationContext);

  if (parents.length === 0) {
    return <SideNavItem />;
  }

  const [{ title, url }] = parents.slice(-1);
  if (!title || title.length === 0 || !url) {
    return <SideNavItem />;
  }

  const titleNodes = title.map((child, i) => <ComponentFactory key={i} nodeData={child} />);
  return (
    <SideNavItem as="a" href={url} glyph={<Icon glyph="ArrowLeft" size="small" />}>
      Back to {titleNodes}
    </SideNavItem>
  );
};

export default SidebarBack;
