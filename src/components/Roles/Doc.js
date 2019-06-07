import React from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import { findKeyValuePair } from '../../utils/find-key-value-pair';

const RoleDoc = ({ nodeData: { label, target }, refDocMapping }) => {
  const getLinkText = labelText => {
    const slug = labelText.startsWith('/') ? labelText.substr(1) : labelText;
    return findKeyValuePair(refDocMapping[slug].ast.children, 'type', 'heading').children[0].value;
  };

  const labelDisplay = label && label.value ? label.value : getLinkText(target);
  return (
    <Link to={target} className="reference internal">
      {labelDisplay}
    </Link>
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
