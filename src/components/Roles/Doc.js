import React from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import { getNestedValue } from '../../utils/get-nested-value';

const RoleDoc = ({ nodeData: { label, target }, pageTitles }) => {
  const getLinkText = labelText => {
    const slug = labelText.startsWith('/') ? labelText.substr(1) : labelText;
    return getNestedValue([slug, 'title'], pageTitles) || slug;
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
};

export default RoleDoc;
