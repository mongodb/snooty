import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const Section = props => {
  const { nodeData } = props;
  return (
    <section>
      {nodeData.children.map((child, index) => {
        if (child.type === 'text') {
          return <React.Fragment key={index}>{child.value}</React.Fragment>;
        }
        return <ComponentFactory {...props} nodeData={child} key={index} />;
      })}
    </section>
  );
};

Section.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.array.isRequired,
  }).isRequired,
};

export default Section;
