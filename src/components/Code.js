import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Highlight from 'react-highlight';
import { reportAnalytics } from '../util';
import 'highlight.js/styles/a11y-light.css';
import URIText, {
  URI_PLACEHOLDER,
  USERNAME_PLACEHOLDER,
  URISTRING_SHELL_PLACEHOLDER,
  URISTRING_SHELL_NOUSER_PLACEHOLDER,
} from './URIText';

const URI_PLACEHOLDERS = [
  URI_PLACEHOLDER,
  USERNAME_PLACEHOLDER,
  URISTRING_SHELL_PLACEHOLDER,
  URISTRING_SHELL_NOUSER_PLACEHOLDER,
];

export default class Code extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copied: false,
    };
  }

  copyCodeButton = code => {
    if (!document) return;
    const tempElement = document.createElement('textarea');
    tempElement.style.position = 'fixed';
    document.body.appendChild(tempElement);
    tempElement.value = code;
    tempElement.select();
    try {
      const successful = document.execCommand('copy');
      if (!successful) throw new Error('Failed to copy');
      // show copied bubble
      this.setState({
        copied: true,
      });
      // hide after some time passes
      setTimeout(() => {
        this.setState({
          copied: false,
        });
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      document.body.removeChild(tempElement);
    }
  };

  render() {
    const { copied } = this.state;
    const {
      nodeData: { value, lang },
      activeTabs: { cloud },
      uri,
    } = this.props;
    let code = value;
    if (URI_PLACEHOLDERS.some(placeholder => code.includes(placeholder))) {
      code = <URIText value={code} activeDeployment={cloud} uri={uri} />;
    }
    return (
      <div className="button-code-block">
        <div className="button-row">
          <button
            className="code-button--copy code-button"
            type="button"
            onClick={() => {
              this.copyCodeButton(value);
              reportAnalytics('Codeblock Copied', {
                code: value,
              });
            }}
          >
            copy
            <div
              className={`code-button__tooltip ${
                copied ? 'code-button__tooltip--active' : 'code-button__tooltip--inactive'
              }`}
            >
              copied
            </div>
          </button>
        </div>
        <div className={`copyable-code-block notranslate highlight-${lang}`}>
          <div className="highlight">
            <Highlight className={lang}>{code}</Highlight>
          </div>
        </div>
      </div>
    );
  }
}

Code.propTypes = {
  nodeData: PropTypes.shape({
    value: PropTypes.string.isRequired,
  }).isRequired,
  activeTabs: PropTypes.shape({
    cloud: PropTypes.string,
  }).isRequired,
  uri: PropTypes.shape({
    atlas: PropTypes.string,
    authSource: PropTypes.string,
    database: PropTypes.string,
    env: PropTypes.string,
    hostlist: PropTypes.object,
    replicaSet: PropTypes.string,
    username: PropTypes.string,
  }),
};

Code.defaultProps = {
  uri: undefined,
};
