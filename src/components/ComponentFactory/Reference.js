import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './index';
import Link from '../Link';

const Reference = ({ nodeData }) => {
  return (
    <Link className="reference external" to={nodeData.refuri}>
      {nodeData.children.map((element, index) => (
        <ComponentFactory key={index} nodeData={element} />
      ))}
    </Link>
  );
};

Reference.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.array.isRequired,
    refuri: PropTypes.string.isRequired,
  }).isRequired,
};

export default Reference;
