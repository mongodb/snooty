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
    // role with interaction
    if (this.roleDataTypes[this.props.nodeData.name]) {
      const termModified = this.props.nodeData.target.replace('()', '').replace('$', '');
      const href = this.roleDataTypes[this.props.nodeData.name](termModified);
      return (
        <a href={ href } onMouseEnter={ (e) => { this.props.modal(e, href) } }>
          { this.props.nodeData.label }
        </a>
      )
    }
  }

  render() {
    return this.roleRendering()
  }

}