import React from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import { getNestedValue } from '../../utils/get-nested-value';

const RoleDoc = ({ nodeData: { label, target }, pageMetadata }) => {
  const getLinkText = labelText => {
    const slug = labelText.startsWith('/') ? labelText.substr(1) : labelText;
    let text = getNestedValue([slug, 'title'], pageMetadata);
    if (!text) {
      text = slug;
      console.warn(`Role title for ${slug} could not be found.`);
    }
    return text;
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
  pageMetadata: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default RoleDoc;
