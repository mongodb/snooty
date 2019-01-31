import React, { Component } from "react";
import ComponentFactory from "./ComponentFactory";

export default class LiteralInclude extends Component {
  constructor(props) {
    super(props);
    let key = this.props.nodeData.argument[0].value;
    // fix for some includes
    if (key && key[0] === "/") {
      key = key.substr(1);
    }
    const startText = this.props.nodeData.options["start-after"];
    const endText = this.props.nodeData.options["end-before"];
    this.resolvedIncludeData = this.props.refDocMapping[key];
    console.log("LIT", this.props.nodeData);
    // extract code example
    this.codeExample =
      typeof this.resolvedIncludeData === "string"
        ? this.resolvedIncludeData.substring(
            this.resolvedIncludeData.indexOf(startText) + startText.length,
            this.resolvedIncludeData.indexOf(endText)
          )
        : "";
  }

  render() {
    return (
      <ComponentFactory
        {...this.props}
        nodeData={{
          type: "code",
          value: this.codeExample
            .substring(0, this.codeExample.lastIndexOf("\n"))
            .trim()
        }}
      />
    );
  }
}
