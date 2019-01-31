import React, { Component } from "react";
import ComponentFactory from "./ComponentFactory";

export default class BlockQuote extends Component {
  render() {
    return (
      <section>
        {this.props.nodeData.children.map((element, index) => (
          <ComponentFactory {...this.props} nodeData={element} key={index} />
        ))}
      </section>
    );
  }
}
