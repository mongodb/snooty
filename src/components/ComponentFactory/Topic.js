import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './index';
import { getNestedValue } from '../../utils/get-nested-value';

const Topic = ({ nodeData, ...rest }) => (
  <div className={['topic', getNestedValue(['options', 'class'], nodeData)].join('')}>
    <p className="topic-title first">
      {nodeData.argument.map((arg, index) => (
        <ComponentFactory {...rest} key={index} nodeData={arg} />
      ))}
    </p>
    {nodeData.children.map((child, index) => (
      <ComponentFactory {...rest} key={index} nodeData={child} />
    ))}
  </div>
);

Topic.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object).isRequired,
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    options: PropTypes.shape({
      class: PropTypes.string,
    }),
  }).isRequired,
};

export default Topic;
