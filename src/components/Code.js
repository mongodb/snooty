import React from 'react';
import PropTypes from 'prop-types';
import hljs from 'highlight.js';
import Highlight from 'react-highlight';
import 'highlight.js/styles/atom-one-light.css';
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

const Code = ({ nodeData: { value, lang }, activeTabs: { cloud }, uri }) => {
  let code = value;
  if (URI_PLACEHOLDERS.some(placeholder => code.includes(placeholder))) {
    code = <URIText value={code} activeDeployment={cloud} uri={uri} />;
  }

  return (
    <div className="button-code-block">
      <div className="button-row">
        <button className="code-button--copy code-button" type="button">
          copy
          <div className="code-button__tooltip code-button__tooltip--inactive">copied</div>
        </button>
      </div>
      <div className="copyable-code-block highlight-python notranslate">
        <div className="highlight">
          <Highlight className={lang}>{code}</Highlight>
        </div>
      </div>
    </div>
  );
};

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

export default Code;

/*
<div className="highlight">
          <pre><code className={lang} style={{'background':'none','padding':'0px','display':'inline'}}>{code}</code></pre>
        </div> */
