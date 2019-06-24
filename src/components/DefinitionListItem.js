import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const DefinitionListItem = ({ nodeData: { children, term }, ...rest }) => (
  <React.Fragment>
    <dt>
      {term.map((child, index) => (
        <ComponentFactory nodeData={child} key={`dt-${index}`} />
      ))}
    </dt>
    <dd>
      {children.map((child, index) => (
        <ComponentFactory {...rest} nodeData={child} key={`dd-${index}`} />
      ))}
    </dd>
  </React.Fragment>
);

DefinitionListItem.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.array.isRequired,
    term: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default DefinitionListItem;
