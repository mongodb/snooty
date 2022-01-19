import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { default as CodeBlock, Language } from '@leafygreen-ui/code';
import { CodeContext } from '../code-context';
import { TabContext } from '../tab-context';
import { theme } from '../../theme/docsTheme';
import { reportAnalytics } from '../../utils/report-analytics';

const captionStyle = css`
  padding: 10px;
  color: #5d6c74;
  font-size: 14px;
  margin-left: 5px;
  border-bottom: none;
`;

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
  const { setActiveTab } = useContext(TabContext);
  const { languageOptions, codeBlockLanguage } = useContext(CodeContext);
  const code = value;
  const language = (languageOptions?.length > 0 && codeBlockLanguage) || getLanguage(lang);
  const captionSpecified = !!caption;
  const captionExists = captionSpecified ? '0px' : '4px';

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

        // Inner div of LG component has a width set to 700px. Unset this as part of our
        // override for docs when the language switcher is being used.
        > div > div {
          width: unset;
        }

        > div {
          border-top-left-radius: ${captionExists};
          border-top-right-radius: ${captionExists};
        }

        // Override default LG Code language switcher font size
        button > div > div {
          font-size: ${theme.fontSize.default};
        }
      `}
    >
      {captionSpecified && (
        <div>
          <CaptionContainer>
            <div css={captionStyle}>{caption}</div>
          </CaptionContainer>
        </div>
      )}
      <CodeBlock
        copyable={copyable}
        highlightLines={emphasizeLines}
        language={language}
        languageOptions={languageOptions}
        onChange={(selectedOption) => {
          const tabsetName = 'drivers';
          setActiveTab({ name: tabsetName, value: selectedOption.id });
        }}
        onCopy={reportCodeCopied}
        showLineNumbers={linenos}
      >
        {code}
      </CodeBlock>
    </div>
  );
};

const CaptionContainer = styled.div`
  border: 1px solid #e7eeec;
  border-bottom: none;
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
`;

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
