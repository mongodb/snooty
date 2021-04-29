import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import Icon from '@leafygreen-ui/icon';
import Link from './Link';
import { NavigationContext } from './navigation-context';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { formatText } from '../utils/format-text';

const SidebarBack = ({ slug, Wrapper }) => {
  const { parents } = useContext(NavigationContext);
  const { project } = useSiteMetadata();

  const Placeholder = () => (
    <Wrapper
      as="div"
      css={css`
        cursor: unset;
        :hover {
          background-color: unset;
        }
      `}
    />
  );

  let title = null,
    url = null;

  if (project === 'landing' && slug !== '/') {
    title = 'home';
    url = '/';
  } else if (parents.length) {
    [{ title, url }] = parents.slice(-1);
  } else {
    return <Placeholder />;
  }

  if (!title || !title.length || !url) {
    return <Placeholder />;
  }

  return (
    <Wrapper as={Link} to={url} glyph={<Icon glyph="ArrowLeft" size="small" />}>
      Back to {formatText(title)}
    </Wrapper>
  );
};

SidebarBack.propTypes = {
  Wrapper: PropTypes.elementType,
};

export default SidebarBack;
