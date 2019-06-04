import React from 'react';
import PropTypes from 'prop-types';

const RoleCode = ({ nodeData: { label, name, target } }) => {
  const base = 'https://docs.mongodb.com/manual/reference';
  const classNameComplete = `mongodb-${name} xref mongodb docutils literal notranslate`;
  let termModified = label && label.value ? label.value : target;
  let href;

  if (name === 'binary') {
    const program = target.includes('bin')
      ? target
          .split('.')
          .slice(1)
          .join('.')
      : target;
    const id = target.includes('bin') ? target : `bin.${target}`;
    termModified = label && label.value ? label.value : program;
    href = `${base}/program/${program}/#${id.replace('~', '')}`;
  } else if (name === 'option') {
    const [program] = target.split('.');
    href = `${base}/program/${program}/#cmdoption-${program}-${termModified.replace('--', '')}`;
  } else if (name === 'authrole') {
    href = `${base}/built-in-roles/#${termModified}`;
  } else if (name === 'setting') {
    href = `${base}/configuration-options/#${termModified}`;
  } else if (name === 'method') {
    const slug = termModified.replace('()', '');
    href = `${base}/method/${slug}/#${slug}`;
  } else if (name === 'query') {
    termModified = termModified.replace('~op.', '');
    const linkTerm = termModified.replace('$', '');
    href = `${base}/operator/query/${linkTerm}/#op._S_${linkTerm}`;
  } else if (name === 'dbcommand') {
    href = `${base}/command/${termModified}/#dbcmd.${termModified}`;
  } else if (name === 'update') {
    termModified = termModified.replace('~up.', '');
    const linkTerm = termModified.replace('$', '');
    href = `${base}/operator/update/${linkTerm}/#up._S_${linkTerm}`;
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
