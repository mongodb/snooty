import React, { Component } from 'react';

export default class Role extends Component {

  constructor() {
    super();
    this.base = `https://docs.mongodb.com/manual/reference`;
    this.roleDataTypes = {
      query: (term) => `${this.base}/operator/query/${term}/#op._S_${term}`,
      dbcommand: (term) => `${this.base}/command/${term}/#dbcmd.${term}`,
      method: (term) => `${this.base}/method/${term}/#${term}`
    };
    this.codeRoles = ['binary'];
  }

  roleRendering() {
    // normal link
    if (this.props.nodeData.name === 'doc') {
      return (
        <a href={ this.props.nodeData.target }>
          { this.props.nodeData.label.value }
        </a>
      )
    } 
    // roles with interaction
    else if (this.roleDataTypes[this.props.nodeData.name]) {
      const termModified = this.props.nodeData.target.replace('()', '').replace('$', '');
      const href = this.roleDataTypes[this.props.nodeData.name](termModified);
      return (
        <a href={ href } onMouseEnter={ (e) => { this.props.modal(e, href) } }>
          { this.props.nodeData.label }
        </a>
      )
    } 
    // binary case is unique (maybe others will be as well)
    else if (this.codeRoles.includes(this.props.nodeData.name)) {
      const termModified = this.props.nodeData.target.substr(this.props.nodeData.target.indexOf('.') + 1);
      const href = `${this.base}/program/${termModified}/#${this.props.nodeData.target.replace('~', '')}`
      return (
        <a href={ href } className="reference external" onMouseEnter={ (e) => { this.props.modal(e, href) } }>
          <code className="xref mongodb mongodb-binary docutils literal notranslate">
            <span className="pre">
              { termModified }
            </span>
          </code>
        </a>
      )
    } else {
      return <span>==Role not implemented: { this.props.nodeData.name } ==</span>
    }
  }

  render() {
    return this.roleRendering()
  }

}