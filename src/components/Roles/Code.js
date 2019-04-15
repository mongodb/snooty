import React from 'react';
import PropTypes from 'prop-types';

const RoleCode = ({ nodeData: { label, name, target }, nodeData }) => {
  const base = 'https://docs.mongodb.com/manual/reference';
  const classNameComplete = `mongodb-${name} xref mongodb docutils literal notranslate`;
  let termModified;
  let href;
  // each code role has its own properties
  if (name === 'binary') {
    termModified = label.value || target.substr(target.indexOf('.') + 1);
    href = `${base}/program/${termModified}/#${target.replace('~', '')}`;
  } else if (name === 'option') {
    termModified = label.value;
    href = `${base}/program/mongoimport/#cmdoption-mongoimport-${termModified.replace('--', '')}`;
  } else if (name === 'authrole') {
    termModified = label;
    href = `${base}/built-in-roles/#${termModified}`;
  } else if (name === 'setting') {
    termModified = label;
    href = `${base}/configuration-options/#${termModified}`;
  } else if (name === 'method') {
    termModified = label;
    href = `${base}/method/${termModified}/#${termModified}`;
  } else if (name === 'query') {
    termModified = label.replace('~op.', '');
    href = `${base}/operator/query/${termModified.replace('$', '')}/#op._S_${termModified}`;
  } else if (name === 'dbcommand') {
    termModified = label;
    href = `${base}/command/${termModified}/#dbcmd.${termModified}`;
  } else if (name === 'update') {
    termModified = label.replace('~up.', '');
    href = `${base}/operator/update/${termModified.replace('$', '')}/#up._S_${termModified}`;
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
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    name: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
  }).isRequired,
};

export default RoleCode;
