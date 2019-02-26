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
    this.codeRoles = ['binary'];
  }

  roleRendering() {
    const { modal, nodeData } = this.props;
    // normal link
    if (nodeData.name === 'doc') {
      return <a href={nodeData.target}>{nodeData.label.value}</a>;
    }
    // roles with interaction
    if (this.roleDataTypes[nodeData.name]) {
      const termModified = nodeData.target.replace('()', '').replace('$', '');
      const href = this.roleDataTypes[nodeData.name](termModified);
      return (
        <a
          href={href}
          onMouseEnter={e => {
            modal(e, href);
          }}
        >
          {nodeData.label}
        </a>
      );
    }
    // binary case is unique (maybe others will be as well)
    if (this.codeRoles.includes(nodeData.name)) {
      const termModified = nodeData.target.substr(nodeData.target.indexOf('.') + 1);
      const href = `${this.base}/program/${termModified}/#${nodeData.target.replace('~', '')}`;
      return (
        <a
          href={href}
          className="reference external"
          onMouseEnter={e => {
            modal(e, href);
          }}
        >
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
  modal: PropTypes.func,
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

Role.defaultProps = {
  modal: () => {},
};
