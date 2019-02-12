import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const BlockQuote = props => {
  const { nodeData } = props;
  return (
    <section>
      {nodeData.children.map((element, index) => (
        <ComponentFactory {...props} nodeData={element} key={index} />
      ))}
    </section>
  );
};

BlockQuote.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.array.isRequired,
  }).isRequired,
};

export default BlockQuote;
