import React, { Component } from 'react';

export default class Figure extends Component {

  render() {
    const line = this.props.nodeData.position.start.line;
    const file = this.props.filename;
    const isActive = (this.props.activePosition === line && this.props.activeFile === file)
      ? 'highlight' : '';
    const hasComment = this.props.lineHasComment(line, file) ? 'highlight-light' : '';
    return (
      <div onClick={(event) => this.props.handleClick(event, line, this.props.filename)} className={`${hasComment} ${isActive}`}>
        <img src={ this.props.nodeData.argument[0].value } alt={ this.props.nodeData.options.alt ? this.props.nodeData.options.alt : this.props.nodeData.argument[0].value } width="50%" />
      </div>
    )
  }

}
