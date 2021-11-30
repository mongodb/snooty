import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './index';

const Section = ({ sectionDepth, nodeData: { children }, ...rest }) => {
  return (
    <section>
      {children.map((child, index) => {
        return <ComponentFactory {...rest} nodeData={child} key={index} sectionDepth={sectionDepth + 1} />;
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
