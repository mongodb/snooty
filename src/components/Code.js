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
import { theme } from '../theme/docsTheme';

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
  } else if (['c', 'csharp'].includes(lang)) {
    // LeafyGreen renders all C-family languages with "clike"
    return 'clike';
  }
  return 'none';
};

const Code = ({
  nodeData: { copyable, emphasize_lines: emphasizeLines, lang, linenos, value },
  uriWriter: { cloudURI, localURI },
}) => {
  const { activeTabs } = useContext(TabContext);

  let code = value;

  if (activeTabs && URI_PLACEHOLDERS.some(placeholder => code.includes(placeholder))) {
    const { cloud } = activeTabs;
    const activeUri = cloud === 'cloud' ? cloudURI : localURI;
    code = ReactDOMServer.renderToString(<URIText value={code} activeDeployment={cloud} uriData={activeUri} />);
    if (isBrowser) code = htmlDecode(code);
  }

  return (
    <div
      css={css`
        margin: ${theme.size.default} 0;
      `}
    >
      <CodeBlock
        copyable={copyable}
        css={css`
          & * {
            overflow-wrap: normal !important;
            white-space: pre;
            word-break: normal !important;
          }
        `}
        highlightLines={emphasizeLines}
        language={getLanguage(lang)}
        showLineNumbers={linenos}
      >
        {code}
      </CodeBlock>
    </div>
  );
};

Code.propTypes = {
  nodeData: PropTypes.shape({
    copyable: PropTypes.bool,
    emphasize_lines: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)])),
    lang: PropTypes.string,
    linenos: PropTypes.bool,
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
