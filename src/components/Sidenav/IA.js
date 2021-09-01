import React from 'react';
import PropTypes from 'prop-types';
import { SideNavGroup, SideNavItem } from '@leafygreen-ui/side-nav';
import Link from '../Link';
import { formatText } from '../../utils/format-text';

const IA = ({ handleClick, header, ia }) => (
  <SideNavGroup header={header}>
    {ia.map(({ title, slug, url }) => {
      const target = slug || url;
      return (
        <SideNavItem key={target} as={Link} onClick={handleClick} to={target}>
          {formatText(title)}
        </SideNavItem>
      );
    })}
  </SideNavGroup>
);

IA.propTypes = {
  handleClick: PropTypes.func,
  header: PropTypes.element,
  ia: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.arrayOf(PropTypes.object),
      slug: PropTypes.string,
      url: PropTypes.string,
    })
  ),
};

export default IA;
