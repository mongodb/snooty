import React from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import { findKeyValuePair } from '../../utils/find-key-value-pair';
import { getNestedValue } from '../../utils/get-nested-value';

const RoleDoc = ({ nodeData: { label, target }, refDocMapping }) => {
  const getLinkText = labelText => {
    const slug = labelText.startsWith('/') ? labelText.substr(1) : labelText;
    return getNestedValue(
      ['children', 0, 'value'],
      findKeyValuePair(getNestedValue([slug, 'ast', 'children'], refDocMapping), 'type', 'heading')
    );
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
