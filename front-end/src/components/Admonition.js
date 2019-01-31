import React, { Component } from "react";
import ComponentFactory from "./ComponentFactory";

export default class Admonition extends Component {
  // backwards compatible css classnames
  admonitionRendering() {
    if (this.props.nodeData.name === "admonition") {
      return (
        <div
          className={`admonition admonition-${this.props.nodeData.argument[0].value
            .toLowerCase()
            .replace(/\s/g, "-")}`}
        >
          <p className="first admonition-title">
            {this.props.nodeData.argument[0].value}
          </p>
          <section>
            <ComponentFactory
              {...this.props}
              nodeData={{
                type: "paragraph",
                children: this.props.nodeData.children[0].children
              }}
              admonition
            />
          </section>
        </div>
      );
    }
    return (
      <div
        className={
          this.props.nodeData.name === "tip"
            ? "admonition admonition-tip"
            : `admonition ${this.props.nodeData.name}`
        }
      >
        <p className="first admonition-title">{this.props.nodeData.name}</p>
        <section>
          <ComponentFactory
            {...this.props}
            admonition
            nodeData={{
              type: "paragraph",
              children:
                this.props.nodeData.children.length > 0
                  ? [
                      ...this.props.nodeData.children[0].children,
                      ...this.props.nodeData.argument
                    ]
                  : this.props.nodeData.argument
            }}
          />
        </section>
      </div>
    );
  }

  render() {
    return this.admonitionRendering();
  }
}
