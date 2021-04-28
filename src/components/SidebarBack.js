import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import Icon from '@leafygreen-ui/icon';
import ComponentFactory from './ComponentFactory';
import { NavigationContext } from './navigation-context';

const SidebarBack = ({ Wrapper }) => {
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

  const { parents } = useContext(NavigationContext);

  if (parents.length === 0) {
    return <Placeholder />;
  }

  const [{ title, url }] = parents.slice(-1);
  if (!title || title.length === 0 || !url) {
    return <Placeholder />;
  }

  const titleNodes = title.map((child, i) => <ComponentFactory key={i} nodeData={child} />);
  return (
    <Wrapper as="a" href={url} glyph={<Icon glyph="ArrowLeft" size="small" />}>
      Back to {titleNodes}
    </Wrapper>
  );
};

SidebarBack.propTypes = {
  Wrapper: PropTypes.elementType,
};

export default SidebarBack;
