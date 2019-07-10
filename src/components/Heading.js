import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const Heading = ({ sectionDepth, nodeData, ...rest }) => {
  const id = nodeData.id || '';
  const HeadingTag = sectionDepth <= 6 ? `h${sectionDepth}` : 'h6';
  return (
    <HeadingTag id={id}>
      {nodeData.children.map((element, index) => {
        return <ComponentFactory {...rest} nodeData={element} key={index} />;
      })}
      <a className="headerlink" href={`#${id}`} title="Permalink to this headline">
        ¶
      </a>
    </HeadingTag>
  );
};

Heading.propTypes = {
  sectionDepth: PropTypes.number.isRequired,
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
