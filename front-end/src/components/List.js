import React, { Component } from "react";
import ComponentFactory from "./ComponentFactory";

export default class List extends Component {
  render() {
    return (
      <ul>
        {this.props.nodeData.children.map((item, index) => (
          <li key={index}>
            {item.children.map((listItem, listItemIndex) => (
              <ComponentFactory
                {...this.props}
                nodeData={listItem}
                key={listItemIndex}
              />
            ))}
          </li>
        ))}
      </ul>
    );
  }
}
