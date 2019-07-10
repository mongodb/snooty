import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const Section = props => {
  const { sectionDepth, nodeData } = props;
  return (
    <section>
      {nodeData.children.map((child, index) => {
        return <ComponentFactory {...props} nodeData={child} key={index} sectionDepth={sectionDepth + 1} />;
      })}
    </section>
  );
};

Section.propTypes = {
  sectionDepth: PropTypes.number,
  nodeData: PropTypes.shape({
    children: PropTypes.array.isRequired,
  }).isRequired,
};

Section.defaultProps = {
  sectionDepth: 0,
};

export default Section;
