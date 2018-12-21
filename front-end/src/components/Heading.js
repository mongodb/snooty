import React, { Component } from 'react';

export default class Heading extends Component {

  render() {
    return (
      <h3>{ this.props.nodeData.children[0].value }
        <a className="headerlink" href="#BLA-BLA" title="Permalink to this headline">¶</a>
      </h3>
    )
  }

}