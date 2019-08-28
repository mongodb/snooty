import React from 'react';
import PropTypes from 'prop-types';
import { getNestedValue } from '../utils/get-nested-value';

const Data = ({ nodeData }) => {
  const displayText = getNestedValue(['argument', 0, 'value'], nodeData);
  return (
    <dl className="data">
      <dt id={displayText}>
        <code className="descname">{displayText}</code>
        <a className="headerlink" href={`#${displayText}`} title="Permalink to this definition">
          ¶
        </a>
      </dt>
    </dl>
  );
};

Data.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};

export default Data;
