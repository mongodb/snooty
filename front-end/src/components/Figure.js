import React, { Component} from 'react';

export default class Figure extends Component {

  render() {
    return (
      <img src={ this.props.figureData.argument[0].value } alt={ this.props.figureData.options.alt ? this.props.figureData.options.alt : this.props.figureData.argument[0].value } width="50%" />
    )
  }

}