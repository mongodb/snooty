import React, { Component } from 'react';

export default class Code extends Component {

  render() {
    return (
      <div className="button-code-block">
        <div className="button-row">
          <a className="code-button--copy code-button" role="button">copy<div className="code-button__tooltip code-button__tooltip--inactive">copied</div></a>
        </div>
        <div className="copyable-code-block highlight-python notranslate">
          <div className="highlight">
            <pre>
              { this.props.nodeData.value }
            </pre>
          </div>
        </div>
      </div>
    )
  }

}