import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@leafygreen-ui/icon';
import { SideNavItem } from '@leafygreen-ui/side-nav';
import Link from './Link';
import { formatText } from '../utils/format-text';

// Adapted from docs-nav branch
// TODO: Resolve merge conflicts when merging docs-nav into master
const SidebarBack = ({ border, enableGlyph = true, textOverride, title, url, ...props }) => {
  const glyph = enableGlyph ? <Icon glyph="ArrowLeft" size="small" /> : undefined;

  return (
    <>
      <SideNavItem as={Link} to={url} glyph={glyph} {...props}>
        {textOverride || `Back to ${formatText(title)}`}
      </SideNavItem>
      {border}
    </>
  );
};

SidebarBack.propTypes = {
  border: PropTypes.element,
  enableGlyph: PropTypes.bool,
  textOverride: PropTypes.string,
  title: PropTypes.string,
  url: PropTypes.string,
};

export default SidebarBack;
