import React from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@leafygreen-ui/emotion';
import { InlineKeyCode } from '@leafygreen-ui/typography';
import ComponentFactory from '../ComponentFactory';

const darkModeOverwriteStyling = css`
  color: var(--font-color-primary);
  background-color: var(--background-color-primary);
`;

const Kbd = ({ nodeData: { children } }) => (
  <InlineKeyCode className={cx(darkModeOverwriteStyling)}>
    {children.map((node, i) => (
      <ComponentFactory key={i} nodeData={node} />
    ))}
  </InlineKeyCode>
);

Kbd.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Kbd;
