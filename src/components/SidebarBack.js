import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import Icon from '@leafygreen-ui/icon';
import { SideNavItem } from '@leafygreen-ui/side-nav';
import Link from './Link';
import { NavigationContext } from './navigation-context';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { formatText } from '../utils/format-text';

const Placeholder = () => (
  <SideNavItem
    as="div"
    css={css`
      cursor: unset;
      margin-bottom: 33px;
      :hover {
        background-color: unset;
      }
    `}
  />
);

const SidebarBack = ({ border, handleClick, slug }) => {
  const { parents } = useContext(NavigationContext);
  const { project } = useSiteMetadata();

  let title = null,
    url = null;

  if (project === 'landing') {
    if (slug === '/') {
      // At homepage; nothing to link back to
      return null;
    }
    title = 'home';
    url = '/';
  } else if (parents.length) {
    [{ title, url }] = parents.slice(-1);
  } else {
    // Show placeholder since the data is likely being fetched
    return <Placeholder />;
  }

  if (!title || !title.length || !url) {
    return null;
  }

  return (
    <>
      <SideNavItem as={Link} to={url} glyph={<Icon glyph="ArrowLeft" size="small" />} onClick={handleClick}>
        Back to {formatText(title)}
      </SideNavItem>
      {border}
    </>
  );
};

SidebarBack.propTypes = {
  border: PropTypes.element,
  slug: PropTypes.string,
};

export default SidebarBack;
