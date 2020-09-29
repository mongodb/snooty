import React, { useContext } from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { default as CodeBlock, Language } from '@leafygreen-ui/code';
import {
  URI_PLACEHOLDER,
  USERNAME_PLACEHOLDER,
  URISTRING_SHELL_PLACEHOLDER,
  URISTRING_SHELL_NOUSER_PLACEHOLDER,
} from './URIWriter/constants';
import { TabContext } from './tab-context';
import URIText from './URIWriter/URIText';
import { isBrowser } from '../utils/is-browser';

const URI_PLACEHOLDERS = [
  URI_PLACEHOLDER,
  USERNAME_PLACEHOLDER,
  URISTRING_SHELL_PLACEHOLDER,
  URISTRING_SHELL_NOUSER_PLACEHOLDER,
];

const htmlDecode = input => {
  const doc = new DOMParser().parseFromString(input, 'text/html');
  return doc.documentElement.textContent;
};

const getLanguage = lang => {
  if (Object.values(Language).includes(lang)) {
    return lang;
  } else if (lang === 'sh') {
    // Writers commonly use 'sh' to represent shell scripts, but LeafyGreen and Highlight.js use the key 'shell'
    return 'shell';
  } else if (lang === 'js') {
    // TODO: Remove this clause when LeafyGreen adds js alias
    // https://jira.mongodb.org/browse/PD-843
    return 'javascript';
  }
  return 'none';
};

const Code = ({ nodeData: { copyable, lang = 'none', linenos, value }, uriWriter: { cloudURI, localURI } }) => {
  const { activeTabs } = useContext(TabContext);

  let code = value;

  if (activeTabs && URI_PLACEHOLDERS.some(placeholder => code.includes(placeholder))) {
    const { cloud } = activeTabs;
    const activeUri = cloud === 'cloud' ? cloudURI : localURI;
    code = ReactDOMServer.renderToString(<URIText value={code} activeDeployment={cloud} uriData={activeUri} />);
    if (isBrowser) code = htmlDecode(code);
  }

  return (
    <CodeBlock
      copyable={copyable}
      css={css`
        & * {
          overflow-wrap: normal !important;
          white-space: pre;
          word-break: normal !important;
        }
      `}
      language={getLanguage(lang)}
      showLineNumbers={linenos}
    >
      {code}
    </CodeBlock>
  );
};

Code.propTypes = {
  nodeData: PropTypes.shape({
    lang: PropTypes.string,
    value: PropTypes.string.isRequired,
  }).isRequired,
  uriWriter: PropTypes.shape({
    cloudURI: PropTypes.object,
    localURI: PropTypes.object,
  }),
};

Code.defaultProps = {
  uriWriter: {
    cloudURI: undefined,
    localURI: undefined,
  },
};

export default Code;
