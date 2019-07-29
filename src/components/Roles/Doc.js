import React from 'react';
import { withPrefix } from 'gatsby';
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
    // TODO: Replace <a> with <Link> when back button behavior is fixed for the component
    // GitHub issue: https://github.com/gatsbyjs/gatsby/issues/8357
    <a href={withPrefix(target)} className="reference internal">
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
  pageMetadata: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default RoleDoc;
