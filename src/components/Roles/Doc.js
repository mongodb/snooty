import React from 'react';
import PropTypes from 'prop-types';
import { formatText } from '../../utils/format-text';
import { getNestedValue } from '../../utils/get-nested-value';
import Link from '../Link';

const RoleDoc = ({ nodeData: { label, target }, slugTitleMapping }) => {
  let labelDisplay = getNestedValue(['value'], label);
  if (!labelDisplay) {
    const key = target.startsWith('/') ? target.slice(1) : target;
    const text = getNestedValue([key], slugTitleMapping);
    labelDisplay = text ? formatText(slugTitleMapping[key]) : target;
  }

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
  slugTitleMapping: PropTypes.shape({
    [PropTypes.string]: PropTypes.oneOf([PropTypes.array, PropTypes.string]),
  }),
};

export default RoleDoc;
