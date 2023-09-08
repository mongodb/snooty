import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import Link from './Link';

const StandaloneHeader = ({ nodeData: { argument, options } }) => {
  return (
    <div>
      {argument.map((child, i) => (
        <ComponentFactory nodeData={child} key={i} />
      ))}
      <Link to={options.url}>{options.cta}</Link>
    </div>
  );
};

StandaloneHeader.prototype = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object),
    options: PropTypes.shape({
      columns: PropTypes.number,
    }),
  }).isRequired,
};

export default StandaloneHeader;
