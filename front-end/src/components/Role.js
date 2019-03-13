import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Role extends Component {
  constructor() {
    super();
    this.base = 'https://docs.mongodb.com/manual/reference';
    this.linkRoles = ['doc', 'manual'];
    this.codeRoles = ['binary', 'option', 'authrole', 'setting', 'method', 'query', 'dbcommand'];
  }

  roleRendering() {
    const { nodeData } = this.props;
    // remove namespace
    if (nodeData.name.includes(':')) {
      const splitNames = nodeData.name.split(':');
      nodeData.name = splitNames[1];
    }
    // guilabel
    if (nodeData.name === 'guilabel') {
      return <span className="guilabel">{nodeData.label}</span>;
    }
    // bolded `program` role
    if (nodeData.name === 'program') {
      return <strong className="program">{nodeData.label}</strong>;
    }
    // normal link
    if (this.linkRoles.includes(nodeData.name)) {
      const label = nodeData.label && nodeData.label.value ? nodeData.label.value : nodeData.label;
      return (
        <a href={nodeData.target} className="reference external">
          {label}
        </a>
      );
    }
    // ref role
    // TODO: link to target properly and not hardcode url
    if (nodeData.name === 'ref') {
      const label = nodeData.label && nodeData.label.value ? nodeData.label.value : nodeData.label;
      return (
        <a href={`https://docs.mongodb.com/compass/current/#${nodeData.target}`} className="reference external">
          <span className="xref std std-ref">{label}</span>
        </a>
      );
    }
    // special roles
    if (this.codeRoles.includes(nodeData.name)) {
      let termModified;
      let href;
      const classNameComplete = `mongodb-${nodeData.name} xref mongodb docutils literal notranslate`;
      // TODO: see what can be done about all the slight differences in roles
      if (nodeData.name === 'binary') {
        termModified = nodeData.target.substr(nodeData.target.indexOf('.') + 1);
        href = `${this.base}/program/${termModified}/#${nodeData.target.replace('~', '')}`;
      }
      if (nodeData.name === 'option') {
        termModified = nodeData.label.value;
        href = `${this.base}/program/mongoimport/#cmdoption-mongoimport-${termModified.replace('--', '')}`;
      }
      if (nodeData.name === 'authrole') {
        termModified = nodeData.label;
        href = `${this.base}/built-in-roles/#${termModified}`;
      }
      if (nodeData.name === 'setting') {
        termModified = nodeData.label;
        href = `${this.base}/configuration-options/#${termModified}`;
      }
      if (nodeData.name === 'method') {
        termModified = nodeData.label;
        href = `${this.base}/method/${termModified}/#${termModified}`;
      }
      if (nodeData.name === 'query') {
        termModified = nodeData.label.replace('~op.', '');
        href = `${this.base}/operator/query/${termModified.replace('$', '')}/#op._S_${termModified}`;
      }
      if (nodeData.name === 'dbcommand') {
        termModified = nodeData.label;
        href = `${this.base}/command/${termModified}/#dbcmd.${termModified}`;
      }
      return (
        <a href={href} className="reference external">
          <code className={classNameComplete}>
            <span className="pre">{termModified}</span>
          </code>
        </a>
      );
    }
    return (
      <span>
        ==Role not implemented:
        {nodeData.name} ==
      </span>
    );
  }

  render() {
    return this.roleRendering();
  }
}

Role.propTypes = {
  nodeData: PropTypes.shape({
    label: PropTypes.oneOfType([
      PropTypes.shape({
        value: PropTypes.string.isRequired,
      }),
      PropTypes.string,
    ]),
    name: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
  }).isRequired,
};
