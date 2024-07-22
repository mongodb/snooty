import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import ComponentFactory from '../ComponentFactory';

const guiLabelStyle = css`
  font-style: normal;
  font-weight: 700;
`;

const RoleGUILabel = ({ nodeData: { children } }) => (
  // Keep "guilabel" className for styling when this component is inside of a Heading.
  <span className="guilabel" css={guiLabelStyle}>
    {children.map((node, i) => (
      <ComponentFactory key={i} nodeData={node} />
    ))}
  </span>
);

RoleGUILabel.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.array.isRequired,
  }).isRequired,
};

export default RoleGUILabel;
