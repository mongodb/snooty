import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { default as CodeBlock, Language } from '@leafygreen-ui/code';
import { theme } from '../theme/docsTheme';
import { reportAnalytics } from '../utils/report-analytics';

const getLanguage = (lang) => {
  if (Object.values(Language).includes(lang)) {
    return lang;
  } else if (lang === 'sh') {
    // Writers commonly use 'sh' to represent shell scripts, but LeafyGreen and Highlight.js use the key 'shell'
    return 'shell';
  } else if (['c', 'cpp', 'csharp'].includes(lang)) {
    // LeafyGreen renders all C-family languages with "clike"
    return 'clike';
  }
  return 'none';
};

const Code = ({ nodeData: { caption, copyable, emphasize_lines: emphasizeLines, lang, linenos, value } }) => {
  const code = value;

  const reportCodeCopied = useCallback(() => {
    reportAnalytics('CodeblockCopied', { code });
  }, [code]);

  return (
    <div
      css={css`
        display: table;
        margin: ${theme.size.default} 0;
        min-width: 150px;
        table-layout: fixed;
        width: 100%;
      `}
    >
      <CodeBlock
        chromeTitle={caption}
        copyable={copyable}
        highlightLines={emphasizeLines}
        language={getLanguage(lang)}
        onCopy={reportCodeCopied}
        showLineNumbers={linenos}
        showWindowChrome={caption ? true : false}
      >
        {code}
      </CodeBlock>
    </div>
  );
};

Code.propTypes = {
  nodeData: PropTypes.shape({
    caption: PropTypes.string,
    copyable: PropTypes.bool,
    emphasize_lines: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)])),
    lang: PropTypes.string,
    linenos: PropTypes.bool,
    value: PropTypes.string.isRequired,
  }).isRequired,
};

export default Code;
