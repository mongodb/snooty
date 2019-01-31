import React, { Component } from "react";
import ComponentFactory from "./ComponentFactory";

export default class Tabs extends Component {
  constructor(props) {
    super(props);
    this.props.addLanguages([...this.props.nodeData.children]);
  }

  render() {
    return this.props.nodeData.children.map((tab, index) => (
      <div
        key={index}
        style={{
          display:
            this.props.activeLanguage === undefined ||
            this.props.activeLanguage[0] === tab.argument[0].value
              ? "block"
              : "none"
        }}
      >
        <h3 style={{ color: "green" }}>
{tab.argument[0].value}
          {' '}
Code
        </h3>
        {tab.children.length > 0 ? (
          <ComponentFactory
            {...this.props}
            nodeData={tab.children[0]}
            key={index}
          />
        ) : (
          ""
        )}
      </div>
    ));
  }
}
