import React from 'react';
import PropTypes from 'prop-types';
import { getNestedValue } from '../utils/get-nested-value';

const Contents = ({ nodeData: { argument, options } }) => {
  console.log(options);
  console.log(options.local === true);
  const displayText = getNestedValue([0, 'value'], argument);
  return (
    <div className={['contents', 'topic'].join(' ')} id="on-this-page">
      <p className="topic-title first">{displayText}</p>
    </div>
  );
};

Contents.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.object.isRequired,
    options: PropTypes.object,
  }).isRequired,
};

export default Contents;
