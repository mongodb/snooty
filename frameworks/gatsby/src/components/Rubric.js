import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import ComponentFactory from './ComponentFactory';

const rubricStyle = css`
  font-weight: 700;
`;

const Rubric = ({ nodeData: { argument }, ...rest }) => (
  <p css={rubricStyle}>
    {argument.map((node, i) => (
      <ComponentFactory {...rest} key={i} nodeData={node} />
    ))}
  </p>
);

Rubric.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Rubric;
