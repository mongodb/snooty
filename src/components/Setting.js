import React from 'react';
import PropTypes from 'prop-types';
import { getNestedValue } from '../utils/get-nested-value';

const Setting = ({ nodeData }) => {
  const displayText = getNestedValue(['argument', 0, 'value'], nodeData);
  const [classname, name] = displayText.split('.');
  return (
    <dl className="first last setting">
      <dt id={displayText}>
        <code className="descclassname">{classname}.</code>
        <code className="descname">{name}</code>
        <a className="headerlink" href={`#${displayText}`} title="Permalink to this definition">
          ¶
        </a>
      </dt>
    </dl>
  );
};

Setting.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};

export default Setting;
