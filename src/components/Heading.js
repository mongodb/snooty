import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const Heading = props => {
  const { id, nodeData } = props;
  return (
    <h3>
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
  id: PropTypes.string,
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
};

Heading.defaultProps = {
  id: '',
};

export default Heading;
