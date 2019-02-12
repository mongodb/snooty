import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const Admonition = props => {
  const { nodeData } = props;
  return (
    <React.Fragment>
      {nodeData.name === 'admonition' ? (
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
      ) : (
        <div className={['admonition', `${nodeData.name === 'tip' ? 'admonition-tip' : nodeData.name}`].join(' ')}>
          <p className="first admonition-title">{nodeData.name}</p>
          <section>
            <ComponentFactory
              {...props}
              admonition
              nodeData={{
                type: 'paragraph',
                children:
                  nodeData.children.length > 0
                    ? [...nodeData.children[0].children, ...nodeData.argument]
                    : nodeData.argument,
              }}
            />
          </section>
        </div>
      )}
    </React.Fragment>
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
