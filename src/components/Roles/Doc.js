import React from 'react';
import { withPrefix } from 'gatsby';
import PropTypes from 'prop-types';
import { getNestedValue } from '../../utils/get-nested-value';

const RoleDoc = ({ nodeData: { label, target } }) => {
  const labelDisplay = getNestedValue(['value'], label);
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
};

export default RoleDoc;
