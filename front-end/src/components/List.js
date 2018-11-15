import React, { Component } from 'react';
import ComponentFactory from '../components/ComponentFactory';

export default class List extends Component {

  render() {
    return (
      <ul>
        {
          this.props.nodeData.children.map((item, index) => {
            const line = item.position.start.line;
            const file = this.props.filename;
            const isActive = (this.props.activePosition === line && this.props.activeFile === file)
              ? 'highlight' : '';
            const hasComment = this.props.lineHasComment(line, file) ? 'highlight-light' : '';
            return (
              <li
                className={`${hasComment} ${isActive}`}
                key={ index }
                onClick={(event) => this.props.handleClick(event, item.position.start.line, this.props.filename)}
              >
                {
                  item.children.map((listItem, listItemIndex) => {
                    return <ComponentFactory { ...this.props } nodeData={ listItem } key={ listItemIndex } />
                  })
                }
              </li>
            )
          })
        }
      </ul>
    )
  }

}

