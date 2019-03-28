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
  } else if (nodeData.name === 'option') {
    termModified = nodeData.label.value;
    href = `${base}/program/mongoimport/#cmdoption-mongoimport-${termModified.replace('--', '')}`;
  } else if (nodeData.name === 'authrole') {
    termModified = nodeData.label;
    href = `${base}/built-in-roles/#${termModified}`;
  } else if (nodeData.name === 'setting') {
    termModified = nodeData.label;
    href = `${base}/configuration-options/#${termModified}`;
  } else if (nodeData.name === 'method') {
    termModified = nodeData.label;
    href = `${base}/method/${termModified}/#${termModified}`;
  } else if (nodeData.name === 'query') {
    termModified = nodeData.label.replace('~op.', '');
    href = `${base}/operator/query/${termModified.replace('$', '')}/#op._S_${termModified}`;
  } else if (nodeData.name === 'dbcommand') {
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
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
  }).isRequired,
};

export default RoleCode;
