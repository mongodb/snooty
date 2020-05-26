import React from 'react';
import PropTypes from 'prop-types';
import BaseComponentFactory from '../ComponentFactory';
import ATFImage from './ATFImage';
import Card from './Card';
import CardGroup from './CardGroup';
import Introduction from './Introduction';

const componentMap = {
  'atf-image': ATFImage,
  card: Card,
  'card-group': CardGroup,
  introduction: Introduction,
};

const ComponentFactory = props => {
  const { nodeData } = props;

  const selectComponent = () => {
    const { domain, name, type } = nodeData;

    const lookup = type === 'directive' ? name : type;
    let ComponentType = componentMap[lookup];

    if (!ComponentType) {
      if (domain === 'landing') {
        console.warn(`${name} (${type}) not yet implemented`);
        return null;
      }
      return <BaseComponentFactory {...props} />;
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
