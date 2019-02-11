import React, { Component } from 'react';
import URIText from './URIText.js';

const URI_PLACEHOLDERS = [
  '<URISTRING>',
  '<USERNAME>',
  '<URISTRING_SHELL>',
  '<URISTRING_SHELL_NOUSER>',
];

export default class Code extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { nodeData, templateType, uri } = this.props;

    let code = nodeData.value;
    if (URI_PLACEHOLDERS.some(placeholder => code.includes(placeholder))) {
      code = <URIText value={code} templateType={templateType} uri={uri} />;
    }

    return (
      <div className="button-code-block">
        <div className="button-row">
          <a className="code-button--copy code-button" role="button">copy<div className="code-button__tooltip code-button__tooltip--inactive">copied</div></a>
        </div>
        <div className="copyable-code-block highlight-python notranslate">
          <div className="highlight">
            <pre>
              { code }
            </pre>
          </div>
        </div>
      </div>
    )
  }

}
