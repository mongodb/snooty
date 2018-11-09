import React, { Component } from 'react';
import ComponentFactory from '../components/ComponentFactory';

export default class List extends Component {

  render() {
    return (
      <ul>
        {
          this.props.nodeData.children.map((item, index) => {
            return (
              <li key={ index }>
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

