import React, { Component } from "react";
import ComponentFactory from "./ComponentFactory";

export default class Section extends Component {
  render() {
    return this.props.nodeData.children.map((child, index) => (
      <ComponentFactory {...this.props} nodeData={child} key={index} />
    ));
  }
}
