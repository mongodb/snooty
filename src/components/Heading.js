import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const Heading = props => {
  const { nodeData } = props;
  const id = nodeData.id || '';
  return (
    <h3 id={id}>
      {nodeData.children.map((element, index) => {
        if (element.type === 'text') {
          return <React.Fragment key={index}>{element.value}</React.Fragment>;
        }
        return <ComponentFactory {...props} nodeData={element} key={index} />;
      })}
      <a className="headerlink" href={`#${id}`} title="Permalink to this headline">
        ¶
      </a>
    </h3>
  );
};

Heading.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
      })
    ).isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default Heading;
