import React, { Component } from 'react';
import ComponentFactory from '../components/ComponentFactory';

export default class Section extends Component {

  render() {
    return (
      this.props.nodeData.children.map((child, index) => {
        return <ComponentFactory { ...this.props } nodeData={ child } key={ index } />
      })
    )
  }

}

