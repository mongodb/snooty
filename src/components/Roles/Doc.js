import React from 'react';
import PropTypes from 'prop-types';
import { findKeyValuePair } from '../../util';

const RoleDoc = ({ nodeData: { label, target }, refDocMapping }) => {
  const labelDisplay =
    label.value || findKeyValuePair(refDocMapping[label.substr(1)].ast.children, 'type', 'heading').children[0].value;
  return (
    <a href={target} className="reference internal">
      {labelDisplay}
    </a>
  );
};

RoleDoc.propTypes = {
  nodeData: PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    target: PropTypes.string.isRequired,
  }).isRequired,
  refDocMapping: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default RoleDoc;
