import React from 'react';
import PropTypes from 'prop-types';

const Container = ({ nodeData: { argument, children } }) => {
  const customClass = argument.map(node => node.value).join(' ');
  return (
    <div className={`${customClass} docutils container`}>
      {children.map((element, index) => (
        <ComponentFactory {...rest} nodeData={element} key={index} />
      ))}
    </div>
  );
};

Container.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
      })
    ),
    children: PropTypes.arrayOf(PropTypes.object),
  }),
};

export default Container;
