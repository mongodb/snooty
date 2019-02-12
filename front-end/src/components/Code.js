import React from 'react';
import PropTypes from 'prop-types';

const Code = ({ nodeData: { value } }) => (
  <div className="button-code-block">
    <div className="button-row">
      <button className="code-button--copy code-button" type="button">
        copy
        <div className="code-button__tooltip code-button__tooltip--inactive">copied</div>
      </button>
    </div>
    <div className="copyable-code-block highlight-python notranslate">
      <div className="highlight">
        <pre>{value}</pre>
      </div>
    </div>
  </div>
);

Code.propTypes = {
  nodeData: PropTypes.shape({
    value: PropTypes.string.isRequired,
  }).isRequired,
};

export default Code;
