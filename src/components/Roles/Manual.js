import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from '../ComponentFactory';
import { REF_TARGETS } from '../../constants';

const RoleManual = ({ nodeData: { children, target } }) => {
  return (
    <a href={`${REF_TARGETS.manual}${target.replace('/manual', '')}`}>
      {children.map((node, i) => (
        <ComponentFactory key={i} nodeData={node} />
      ))}
    </a>
  );
};

RoleManual.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
  }).isRequired,
};

export default RoleManual;
