import React, { Component } from "react";

export default class Emphasis extends Component {
  render() {
    return <em>{this.props.nodeData.children[0].value}</em>;
  }
}
