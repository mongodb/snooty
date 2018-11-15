import React, { Component } from 'react';
import ComponentFactory from '../components/ComponentFactory';

export default class Literal extends Component {

  render() {
    const line = this.props.nodeData.position.start.line;
    const file = this.props.filename;
    const isActive = (this.props.activePosition === line && this.props.activeFile === file)
      ? 'highlight' : '';
    const hasComment = this.props.lineHasComment(line, file) ? 'highlight-light' : '';
    return (
      <span onClick={(event) => this.props.handleClick(event, line, this.props.filename)} className={`${hasComment} ${isActive}`}>
        <code className="docutils literal notranslate">
          <span className="pre">{ this.props.nodeData.children[0].value }</span>
        </code>
      </span>
    ) 
  }

}
