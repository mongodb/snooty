import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const Admonition = props => {
  const { nodeData } = props;

  if (nodeData.name === 'admonition') {
    let fullClassName = `admonition admonition-${nodeData.argument[0].value.toLowerCase().replace(/\s/g, '-')}`;
    // special admonitions have options
    if (nodeData.options && nodeData.options.class) {
      fullClassName += ` ${nodeData.options.class}`;
    }
    return (
      <div className={fullClassName}>
        <p className="first admonition-title">{nodeData.argument[0].value}</p>
        <React.Fragment>
          <ComponentFactory
            {...props}
            nodeData={{
              type: 'section',
              children: nodeData.children[0].children,
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
        value: PropTypes.string.isRequired,
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
