import React, { Component } from 'react';
import ComponentFactory from '../components/ComponentFactory';

export default class Paragraph extends Component {

  render() {
    return (
      <p style={ { margin: this.props.admonition ? '0 auto' : '' } }>
        { 
          this.props.nodeData.children.map((element, index) => {
            if (element.type === 'text') {
              return <span key={ index }>{ element.value }</span>
            } else {
              return <ComponentFactory { ...this.props } nodeData={ element } key={ index } />
            }
          })
        }
      </p>
    )
  }

}