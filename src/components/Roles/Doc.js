import React from 'react';
import PropTypes from 'prop-types';
import { findKeyValuePair, getPrefix } from '../../util';

const RoleDoc = ({ nodeData: { label, target }, refDocMapping }) => {
  const getLinkText = labelText => {
    const slug = labelText.startsWith('/') ? labelText.substr(1) : labelText;
    return findKeyValuePair(refDocMapping[slug].ast.children, 'type', 'heading').children[0].value;
  };

  const labelDisplay = label && label.value ? label.value : getLinkText(target);
  return (
    <a href={`${getPrefix()}${target}`} className="reference internal">
      {labelDisplay}
    </a>
  );
};

RoleDoc.propTypes = {
  nodeData: PropTypes.shape({
    label: PropTypes.shape({
      value: PropTypes.string,
    }),
    target: PropTypes.string.isRequired,
  }).isRequired,
  refDocMapping: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default RoleDoc;
