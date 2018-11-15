import React, { Component } from 'react';
import ComponentFactory from '../components/ComponentFactory';

export default class Paragraph extends Component {

  render() {
    return (
      <p
        style={ { margin: this.props.admonition ? '0 auto' : '' } }
        onClick={(event) => this.props.handleClick(event, this.props.nodeData.position.start.line, this.props.filename)}
      >
        { 
          this.props.nodeData.children.map((element, index) => {
            const line = element.position.start.line;
            const file = this.props.filename;
            const isActive = (this.props.activePosition === line && this.props.activeFile === file)
              ? 'highlight' : '';
            const hasComment = this.props.lineHasComment(line, file) ? 'highlight-light' : '';
            if (element.type === 'text') {
              return <span className={`${hasComment} ${isActive}`} key={ index }>{ element.value }</span>
            } else {
              return <ComponentFactory { ...this.props } nodeData={ element } key={ index } />
            }
          })
        }
      </p>
    )
  }

}
