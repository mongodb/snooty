import React, { Component } from 'react';
import ComponentFactory from '../components/ComponentFactory';

export default class Heading extends Component {

  render() {
    const line = this.props.nodeData.children[0].position.start.line;
    const file = this.props.filename;
    const isActive = (this.props.activePosition === line && this.props.activeFile === file)
      ? 'highlight' : '';
    const hasComment = this.props.lineHasComment(line, file) ? 'highlight-light' : '';
    return (
      <h3
        className={`${hasComment} ${isActive}`}
        onClick={(event) => this.props.handleClick(event, this.props.nodeData.children[0].position.start.line, this.props.filename)}
      >{ this.props.nodeData.children[0].value }
        <a className="headerlink" href="#BLA-BLA" title="Permalink to this headline">¶</a>
      </h3>
    )
  }

}
