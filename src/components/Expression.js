import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { getNestedValue } from '../utils/get-nested-value';

const Expression = ({ nodeData, ...rest }) => {
  const expressionName = getNestedValue(['argument', 0, 'value'], nodeData);
  return (
    <dl className="expression">
      <dt id={`exp.${expressionName}`}>
        <code className="descname">{expressionName}</code>
        <a className="headerlink" href={`#exp.${expressionName}`} title="Permalink to this definition">
          ¶
        </a>
      </dt>
      <dd>
        {nodeData.children.map((child, index) => (
          <ComponentFactory {...rest} key={index} nodeData={child} />
        ))}
      </dd>
    </dl>
  );
};

Expression.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(['text']).isRequired,
        value: PropTypes.string.isRequired,
      })
    ),
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Expression;
