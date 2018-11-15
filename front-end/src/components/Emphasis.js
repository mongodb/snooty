import React, { Component } from 'react';

export default class Emphasis extends Component {

  render() {
    const line = this.props.nodeData.position.start.line;
    const file = this.props.filename;
    const isActive = (this.props.activePosition === line && this.props.activeFile === file)
      ? 'highlight' : '';
    const hasComment = this.props.lineHasComment(line, file) ? 'highlight-light' : '';
    return <em onClick={(event) => this.props.handleClick(event, line, this.props.filename)} className={`${hasComment} ${isActive}`}>{ this.props.nodeData.children[0].value }</em>
  }

}
