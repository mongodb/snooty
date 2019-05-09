import React from 'react';
import PropTypes from 'prop-types';

const RoleCode = ({ nodeData: { label, name, target } }) => {
  const base = 'https://docs.mongodb.com/manual/reference';
  const classNameComplete = `mongodb-${name} xref mongodb docutils literal notranslate`;
  let termModified = label && label.value ? label.value : target;
  let href;

  if (name === 'binary') {
    termModified = label && label.value ? label.value : target.substr(target.indexOf('.') + 1);
    href = `${base}/program/${termModified}/#${target.replace('~', '')}`;
  } else if (name === 'option') {
    href = `${base}/program/mongoimport/#cmdoption-mongoimport-${termModified.replace('--', '')}`;
  } else if (name === 'authrole') {
    href = `${base}/built-in-roles/#${termModified}`;
  } else if (name === 'setting') {
    href = `${base}/configuration-options/#${termModified}`;
  } else if (name === 'method') {
    href = `${base}/method/${termModified}/#${termModified}`;
  } else if (name === 'query') {
    termModified = termModified.replace('~op.', '');
    href = `${base}/operator/query/${termModified.replace('$', '')}/#op._S_${termModified}`;
  } else if (name === 'dbcommand') {
    href = `${base}/command/${termModified}/#dbcmd.${termModified}`;
  } else if (name === 'update') {
    termModified = termModified.replace('~up.', '');
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
    label: PropTypes.shape({
      value: PropTypes.string,
    }),
    name: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
  }).isRequired,
};

export default RoleCode;
