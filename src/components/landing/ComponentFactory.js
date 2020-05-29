import React from 'react';
import PropTypes from 'prop-types';
import ATFImage from './ATFImage';
import Card from './Card';
import CardGroup from './CardGroup';
import CTA from './CTA';
import Introduction from './Introduction';

const componentMap = {
  'atf-image': ATFImage,
  card: Card,
  'card-group': CardGroup,
  cta: CTA,
  introduction: Introduction,
};

const ComponentFactory = props => {
  const { nodeData } = props;

  const selectComponent = () => {
    const { name, type } = nodeData;

    const lookup = type === 'directive' ? name : type;
    let ComponentType = componentMap[lookup];

    if (!ComponentType) {
      console.warn(`${lookup} not yet implemented`);
      return null;
    }

    return <ComponentType {...props} />;
  };

  if (!nodeData) return null;

  return selectComponent();
};

ComponentFactory.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string,
    type: PropTypes.string.isRequired,
  }).isRequired,
};

export default ComponentFactory;
