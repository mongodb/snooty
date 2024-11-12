import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from '../ComponentFactory';
import Link from '../Link';

const LinkNewTab = ({ nodeData: { children, target } }) => (
  <Link to={target} openInNewTab={true}>
    {children.map((node, i) => (
      <ComponentFactory key={i} nodeData={node} />
    ))}
  </Link>
);

LinkNewTab.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    target: PropTypes.string.isRequired,
  }).isRequired,
};

export default LinkNewTab;
