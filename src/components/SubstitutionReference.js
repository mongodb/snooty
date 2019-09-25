import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { getNestedValue } from '../utils/get-nested-value';

const SubstitutionReference = ({ nodeData, nodeData: { children, name }, substitutions, ...rest }) => {
  if (getNestedValue([name], substitutions)) {
    return substitutions[name].map((sub, index) => <ComponentFactory {...rest} nodeData={sub} key={index} />);
  }

  if (children) {
    return children.map((child, index) => <ComponentFactory {...rest} nodeData={child} key={index} />);
  }

  // If the map of substitutions does not include the desired substitution definition, don't replace it with anything
  return <React.Fragment>{name}</React.Fragment>;
};

SubstitutionReference.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
      })
    ),
    name: PropTypes.string.isRequired,
  }).isRequired,
  substitutions: PropTypes.objectOf(PropTypes.array).isRequired,
};

export default SubstitutionReference;
