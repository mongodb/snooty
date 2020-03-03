import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const SubstitutionReference = ({ nodeData: { children, name }, ...rest }) => (
  <React.Fragment>
    {children ? children.map((child, index) => <ComponentFactory {...rest} nodeData={child} key={index} />) : name}
  </React.Fragment>
);

SubstitutionReference.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default SubstitutionReference;
