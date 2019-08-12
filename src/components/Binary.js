import React from 'react';
import PropTypes from 'prop-types';
import { getNestedValue } from '../utils/get-nested-value';

const Binary = ({ nodeData }) => {
  const displayText = getNestedValue(['argument', 0, 'value'], nodeData);
  const [, name] = displayText.split('.');
  return (
    <dl className="binary">
      <dt id={displayText}>
        <code className="descname">{name}</code>
        <a className="headerlink" href={`#${displayText}`} title="Permalink to this definition">
          ¶
        </a>
      </dt>
    </dl>
  );
};

Binary.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default Binary;
