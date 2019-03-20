import React from 'react';
import PropTypes from 'prop-types';

const RoleCode = props => {
  const { nodeData } = props;
  const base = 'https://docs.mongodb.com/manual/reference';
  const classNameComplete = `mongodb-${nodeData.name} xref mongodb docutils literal notranslate`;
  let termModified;
  let href;
  // each code role has its own properties
  if (nodeData.name === 'binary') {
    termModified = nodeData.target.substr(nodeData.target.indexOf('.') + 1);
    href = `${base}/program/${termModified}/#${nodeData.target.replace('~', '')}`;
  }
  if (nodeData.name === 'option') {
    termModified = nodeData.label.value;
    href = `${base}/program/mongoimport/#cmdoption-mongoimport-${termModified.replace('--', '')}`;
  }
  if (nodeData.name === 'authrole') {
    termModified = nodeData.label;
    href = `${base}/built-in-roles/#${termModified}`;
  }
  if (nodeData.name === 'setting') {
    termModified = nodeData.label;
    href = `${base}/configuration-options/#${termModified}`;
  }
  if (nodeData.name === 'method') {
    termModified = nodeData.label;
    href = `${base}/method/${termModified}/#${termModified}`;
  }
  if (nodeData.name === 'query') {
    termModified = nodeData.label.replace('~op.', '');
    href = `${base}/operator/query/${termModified.replace('$', '')}/#op._S_${termModified}`;
  }
  if (nodeData.name === 'dbcommand') {
    termModified = nodeData.label;
    href = `${base}/command/${termModified}/#dbcmd.${termModified}`;
  }
  return (
    <a href={href} className="reference external">
      <code className={classNameComplete}>
        <span className="pre">{termModified}</span>
      </code>
    </a>
  );
};

RoleCode.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        value: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
};

export default RoleCode;
