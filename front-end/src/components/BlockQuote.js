import React, { Component } from 'react';
import ComponentFactory from '../components/ComponentFactory';

export default class BlockQuote extends Component {

  render() {
    return (
      <section>
        { 
          this.props.nodeData.children.map((element, index) => {
            return <ComponentFactory { ...this.props } nodeData={ element } key={ index } />
          })
        }
      </section>
    )
  }

}