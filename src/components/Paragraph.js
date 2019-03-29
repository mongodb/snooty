import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const Paragraph = props => {
  const { admonition, nodeData } = props;
  return (
    <p style={{ margin: admonition ? '0 0 12.5px' : '' }}>
      {nodeData.children.map((element, index) => {
        if (element.type === 'text') {
          return <React.Fragment key={index}>{element.value}</React.Fragment>;
        }
        return <ComponentFactory {...props} nodeData={element} key={index} />;
      })}
    </p>
  );
};

Paragraph.propTypes = {
  admonition: PropTypes.bool,
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        value: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
};

Paragraph.defaultProps = {
  admonition: false,
};

export default Paragraph;
