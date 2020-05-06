import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const boldPathParameters = str => {
  const betweenBraces = new RegExp(/(\{).+?(\})/, 'g');
  return str.replace(betweenBraces, match => `<span class="apiref-resource__path-parameter">${match}</span>`);
};

// TODO: Properly handle operation summary
const Operation = ({
  nodeData: {
    children,
    options: { hash, method, path },
  },
}) => (
  <div className={`apiref-resource apiref-resource--${method} apiref-resource--collapsed`} id={hash}>
    <div className="apiref-resource__header" role="button">
      <div className="apiref-resource__method apiref-resource__method">{method}</div>
      <div className="apiref-resource__path" dangerouslySetInnerHTML={{ __html: boldPathParameters(path) }} />
    </div>
    {children.map((child, index) => (
      <ComponentFactory key={index} nodeData={child} sectionDepth="2" />
    ))}
  </div>
);

Operation.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.array,
    options: PropTypes.shape({
      hash: PropTypes.string.isRequired,
      method: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Operation;
