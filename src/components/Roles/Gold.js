import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { palette } from '@leafygreen-ui/palette';
import ComponentFactory from '../ComponentFactory';

const Gold = ({ nodeData: { children } }) => (
  <strong
    css={css`
      color: ${palette.yellow.dark2};

      .dark-theme & {
        color: ${palette.yellow.light2};
      }
    `}
  >
    {children.map((node, i) => (
      <ComponentFactory key={i} nodeData={node} />
    ))}
  </strong>
);

Gold.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Gold;
