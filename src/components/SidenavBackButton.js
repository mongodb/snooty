import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Icon from '@leafygreen-ui/icon';
import { SideNavItem } from '@leafygreen-ui/side-nav';
import Link from './Link';
import { NavigationContext } from './navigation-context';
import { formatText } from '../utils/format-text';

const Placeholder = styled(SideNavItem)`
  cursor: unset;
  margin-bottom: 33px;
  :hover {
    background-color: unset;
  }
`;

const SidenavBackButton = ({ border, currentSlug, handleClick, project, target, titleOverride, ...props }) => {
  const { parents } = useContext(NavigationContext);
  let title = titleOverride;
  let url = target;

  // Fetch page to navigate to using parent category page(s)
  if (!titleOverride) {
    if (project === 'landing') {
      const landingExceptions = ['/', 'search'];

      if (landingExceptions.includes(currentSlug)) {
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
  }

  if (!title || !title.length || !url) {
    return null;
  }

  return (
    <>
      <SideNavItem as={Link} to={url} glyph={<Icon glyph="ArrowLeft" size="small" />} onClick={handleClick} {...props}>
        Back to {formatText(title)}
      </SideNavItem>
      {border}
    </>
  );
};

SidenavBackButton.propTypes = {
  border: PropTypes.element,
  currentSlug: PropTypes.string,
  handleClick: PropTypes.func,
  project: PropTypes.string,
  target: PropTypes.string,
  titleOverride: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.string]),
};

export default SidenavBackButton;
