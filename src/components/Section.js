import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { getNestedValue } from '../utils/get-nested-value';

const Section = props => {
  const { nodeData } = props;
  return (
    <section>
      {nodeData.children.map((child, index) => {
        if (child.type === 'text') {
          return <React.Fragment key={index}>{getNestedValue(['value'], child)}</React.Fragment>;
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
