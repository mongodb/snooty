import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const DefinitionList = ({ nodeData, ...rest }) => {
  return (
    <dl className="first docutils">
      {nodeData.children.map((definition, index) => (
        <ComponentFactory {...rest} nodeData={definition} key={index} />
      ))}
    </dl>
  );
};

DefinitionList.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.array.isRequired,
  }).isRequired,
};

export default DefinitionList;
