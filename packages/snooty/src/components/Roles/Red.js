import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { palette } from '@leafygreen-ui/palette';
import ComponentFactory from '../ComponentFactory';

const Red = ({ nodeData: { children } }) => (
  <strong
    css={css`
      color: ${palette.red.dark2};

      .dark-theme & {
        color: ${palette.red.light1};
      }
    `}
  >
    {children.map((node, i) => (
      <ComponentFactory key={i} nodeData={node} />
    ))}
  </strong>
);

Red.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Red;
