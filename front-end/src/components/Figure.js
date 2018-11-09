import React, { Component } from 'react';

export default class Figure extends Component {

  render() {
    return (
      <img src={ this.props.nodeData.argument[0].value } alt={ this.props.nodeData.options.alt ? this.props.nodeData.options.alt : this.props.nodeData.argument[0].value } width="50%" />
    )
  }

}