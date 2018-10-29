import React, { Component} from 'react';
import Paragraph from '../components/Paragraph';

export default class List extends Component {

  render() {
    return (
      <ul>
        {
          // List can only contain ListItems so no need for check here
          this.props.listData.children.map((item, index) => {
            return (
              <li key={ index }>
                {
                  item.children.map((listItem, listItemIndex) => {
                    if (listItem.type === 'paragraph') {
                      return <Paragraph paragraphData={ listItem } key={ listItemIndex } />
                    } 
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

