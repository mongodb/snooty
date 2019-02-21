import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const Admonition = props => {
  const { nodeData } = props;
  if (nodeData.name === 'admonition') {
    return (
      <div className={`admonition admonition-${nodeData.argument[0].value.toLowerCase().replace(/\s/g, '-')}`}>
        <p className="first admonition-title">{nodeData.argument[0].value}</p>
        <section>
          <ComponentFactory
            {...props}
            nodeData={{
              type: 'paragraph',
              children: nodeData.children[0].children,
            }}
            admonition
          />
        </section>
      </div>
    );
  }
  // combine argument and children from admonition as separate paragraphs
  const childElements = [...nodeData.argument, ...nodeData.children];

  return (
    <div className={nodeData.name === 'tip' ? `admonition admonition-tip` : `admonition ${nodeData.name}`}>
      <p className="first admonition-title">{nodeData.name}</p>
      <section>
        <ComponentFactory
          {...props}
          admonition
          nodeData={{
            type: 'paragraph',
            children: childElements,
          }}
        />
      </section>
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
