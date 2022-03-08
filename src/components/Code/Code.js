import { css } from '@emotion/react';
import React, { useCallback, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { default as CodeBlock, Language } from '@leafygreen-ui/code';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import Tooltip from '@leafygreen-ui/tooltip';
import { uiColors } from '@leafygreen-ui/palette';
import { CodeContext } from '../code-context';
import { TabContext } from '../tab-context';
import { reportAnalytics } from '../../utils/report-analytics';
import { baseCodeStyle, borderCodeStyle } from './styles/codeStyle';

const captionStyle = css`
  padding: 10px;
  color: ${uiColors.gray.dark1};
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

const Code = ({ nodeData: { caption, copyable, emphasize_lines: emphasizeLines, lang, linenos, value, source } }) => {
  const { setActiveTab } = useContext(TabContext);
  const { languageOptions, codeBlockLanguage } = useContext(CodeContext);
  const code = value;
  let language = (languageOptions?.length > 0 && codeBlockLanguage) || getLanguage(lang);
  // none should take precedence over language switcher
  if (getLanguage(lang) === 'none') {
    language = getLanguage(lang);
  }
  const captionSpecified = !!caption;
  const sourceSpecified = !!source;
  const captionBorderRadius = captionSpecified ? '0px' : '4px';
  const [isHovered, setIsHovered] = useState(false);

  let customActionButtonList = [];
  if (sourceSpecified) {
    customActionButtonList = [
      <IconButton href={source} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <Icon glyph="OpenNewTab" />
        <Tooltip
          triggerEvent="hover"
          align="bottom"
          justify="middle"
          darkMode={true}
          popoverZIndex={2}
          open={isHovered}
        >
          View full source
        </Tooltip>
      </IconButton>,
    ];
  }

  const reportCodeCopied = useCallback(() => {
    reportAnalytics('CodeblockCopied', { code });
  }, [code]);

  return (
    <div
      css={css`
        ${baseCodeStyle}

        > div {
          border-top-left-radius: ${captionBorderRadius};
          border-top-right-radius: ${captionBorderRadius};
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
        showCustomActionButtons={sourceSpecified}
        customActionButtons={customActionButtonList}
      >
        {code}
      </CodeBlock>
    </div>
  );
};

const CaptionContainer = styled.div`
  ${borderCodeStyle}
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
    source: PropTypes.string,
  }).isRequired,
};

export default Code;
