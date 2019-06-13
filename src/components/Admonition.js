import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { getNestedValue } from '../utils/get-nested-value';

const Admonition = props => {
  const { nodeData } = props;
  const admonitionType = getNestedValue(['argument', 0, 'value'], nodeData);

  if (nodeData.name === 'admonition') {
    let fullClassName = `admonition admonition-${
      admonitionType ? admonitionType.toLowerCase().replace(/\s/g, '-') : ''
    }`;
    // special admonitions have options
    const definedClass = getNestedValue(['options', 'class'], nodeData);
    if (definedClass) {
      fullClassName += ` ${definedClass}`;
    }
    return (
      <div className={fullClassName}>
        <p className="first admonition-title">{admonitionType}</p>
        <React.Fragment>
          <ComponentFactory
            {...props}
            nodeData={{
              type: 'section',
              children: getNestedValue(['children', 0, 'children'], nodeData),
            }}
            admonition
          />
        </React.Fragment>
      </div>
    );
  }
  // combine argument and children from admonition as separate paragraphs
  const childElements = [...nodeData.argument, ...nodeData.children];
  return (
    <div className={nodeData.name === 'tip' ? `admonition admonition-tip` : `admonition ${nodeData.name}`}>
      <p className="first admonition-title">{nodeData.name}</p>
      <React.Fragment>
        <ComponentFactory
          {...props}
          admonition
          nodeData={{
            type: 'section',
            children: childElements,
          }}
        />
      </React.Fragment>
    </div>
  );
};

Admonition.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
      })
    ).isRequired,
    children: PropTypes.arrayOf(
      PropTypes.shape({
        children: PropTypes.array,
      })
    ),
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default Admonition;
