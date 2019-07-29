import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const SubstitutionReference = ({ nodeData: { name }, substitutions, ...rest }) => {
  // If the map of substitutions does not include the desired substitution definition, don't replace it with anything
  if (!substitutions || !substitutions[name]) {
    return <React.Fragment>{name}</React.Fragment>;
  }

  return substitutions[name].map((sub, index) => <ComponentFactory {...rest} nodeData={sub} key={index} />);
};

SubstitutionReference.propTypes = {
  substitutions: PropTypes.objectOf(PropTypes.array).isRequired,
};

export default SubstitutionReference;
