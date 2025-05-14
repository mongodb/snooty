import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const Container = ({ nodeData: { argument, children }, ...rest }) => {
  const customClass = argument.map((node) => node.value).join(' ');
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
  }).isRequired,
};

export default Container;
