import React from 'react';
import PropTypes from 'prop-types';
import Card from './Card';
import CardGroup from './CardGroup';
import CTA from './CTA';
import DeprecatedVersionSelector from './DeprecatedVersionSelector';
import Introduction from './Introduction';
import Kicker from './Kicker';

const componentMap = {
  card: Card,
  'card-group': CardGroup,
  cta: CTA,
  'deprecated-version-selector': DeprecatedVersionSelector,
  introduction: Introduction,
  kicker: Kicker,
};

const ComponentFactory = props => {
  const { nodeData } = props;

  const selectComponent = () => {
    const { name, type } = nodeData;

    const lookup = type === 'directive' ? name : type;
    let ComponentType = componentMap[lookup];

    if (!ComponentType) {
      console.warn(`${type} "${name}" not yet implemented${props.slug && ` on page ${props.slug}`}`);
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
