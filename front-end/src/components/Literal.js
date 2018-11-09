import React, { Component } from 'react';
import ComponentFactory from '../components/ComponentFactory';

export default class Literal extends Component {

  render() {
    return (
      <code className="docutils literal notranslate">
        <span className="pre">{ this.props.nodeData.children[0].value }</span>
      </code>
    ) 
  }

}