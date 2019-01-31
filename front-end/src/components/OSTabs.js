import React, { Component } from "react";

export default class OSTabs extends Component {
  render() {
    return (
      <div
        className="tabpanel-local"
        data-tabid="local"
        style={{ display: "block" }}
      >
        <div className="tabs" data-tab-preference="platforms">
          <ul className="tab-strip tab-strip--singleton" role="tablist">
            <li
              className="tab-strip__element"
              data-tabid="windows"
              role="tab"
              aria-selected="true"
            >
              Windows
            </li>
            <li
              className="tab-strip__element"
              data-tabid="macos"
              role="tab"
              aria-selected="false"
            >
              macOS
            </li>
            <li
              className="tab-strip__element"
              data-tabid="linux"
              role="tab"
              aria-selected="false"
            >
              Linux
            </li>
          </ul>
          <div className="tabs__content" role="tabpanel">
            <div
              className="tabpanel-windows"
              data-tabid="windows"
              style={{ display: "block" }}
            >
              windows stuff
            </div>
            <div
              className="tabpanel-macos"
              data-tabid="macos"
              style={{ display: "none" }}
            >
              mac stuff
            </div>
            <div
              className="tabpanel-linux"
              data-tabid="linux"
              style={{ display: "none" }}
            >
              linux stuff
            </div>
          </div>
        </div>
      </div>
    );
  }
}
