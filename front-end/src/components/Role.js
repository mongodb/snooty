import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Role extends Component {
  constructor() {
    super();
    this.base = 'https://docs.mongodb.com/manual/reference';
    this.roleDataTypes = {
      query: term => `${this.base}/operator/query/${term}/#op._S_${term}`,
      dbcommand: term => `${this.base}/command/${term}/#dbcmd.${term}`,
      method: term => `${this.base}/method/${term}/#${term}`,
    };
    this.linkRoles = ['doc', 'manual'];
    this.codeRoles = ['binary', 'option', 'authrole', 'setting'];
  }

  roleRendering() {
    const { nodeData } = this.props;
    // normal link
    if (this.linkRoles.includes(nodeData.name)) {
      const label = nodeData.label && nodeData.label.value ? nodeData.label.value : nodeData.label;
      return (
        <a href={nodeData.target} className="reference external">
          {label}
        </a>
      );
    }
    // guilabel
    if (nodeData.name === 'guilabel') {
      return <span className="guilabel">{nodeData.label}</span>;
    }
    // ref role
    if (nodeData.name === 'ref') {
      const label = nodeData.label && nodeData.label.value ? nodeData.label.value : nodeData.label;
      return (
        <a href={`https://docs.mongodb.com/compass/current/#${nodeData.target}`} className="reference external">
          <span className="xref std std-ref">{label}</span>
        </a>
      );
    }
    // basic roles with interaction
    if (this.roleDataTypes[nodeData.name]) {
      const termModified = nodeData.target.replace('()', '').replace('$', '');
      const href = this.roleDataTypes[nodeData.name](termModified);
      return <a href={href}>{nodeData.label}</a>;
    }
    // some special roles
    if (this.codeRoles.includes(nodeData.name)) {
      let termModified;
      let href;
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
      return (
        <a href={href} className="reference external">
          <code className="xref mongodb mongodb-binary docutils literal notranslate">
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
