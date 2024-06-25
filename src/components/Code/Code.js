import { css } from '@emotion/react';
import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { default as CodeBlock } from '@leafygreen-ui/code';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import Tooltip from '@leafygreen-ui/tooltip';
import { palette } from '@leafygreen-ui/palette';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { TabContext } from '../Tabs/tab-context';
import { reportAnalytics } from '../../utils/report-analytics';
import { getLanguage } from '../../utils/get-language';
import { setDriversIconsMap } from '../icons/DriverIconMap';
import { baseCodeStyle, borderCodeStyle } from './styles/codeStyle';
import { CodeContext } from './code-context';

const sourceCodeStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Returns the icon associated with the driver language that would be
// shown on our TabSelector component
const getDriverImage = (driver, driverIconMap) => {
  const DriverIcon = driverIconMap[driver];
  if (DriverIcon) {
    return <DriverIcon />;
  }

  // Use LG File icon as our default placeholder for images. This overwrites
  // LG's Language Switcher current default icon. See:
  // https://github.com/mongodb/leafygreen-ui/blob/6041b89bf5f9dc1e5ea76018bc2cd84bc1fd6faf/packages/code/src/LanguageSwitcher.tsx#L135-L136
  return <Icon glyph="File" />;
};

const Code = ({
  nodeData: { caption, copyable, emphasize_lines: emphasizeLines, lang, linenos, value, source, lineno_start },
  darkMode: darkModeProp,
}) => {
  const { setActiveTab } = useContext(TabContext);
  const { languageOptions, codeBlockLanguage } = useContext(CodeContext);
  const { darkMode } = useDarkMode();
  const code = value;
  let language = (languageOptions?.length > 0 && codeBlockLanguage) || getLanguage(lang);

  const driverIconMap = setDriversIconsMap();

  languageOptions.map((option) => {
    option.image = getDriverImage(option.id, driverIconMap);
    return option;
  });

  // none should take precedence over language switcher
  if (getLanguage(lang) === 'none') {
    language = getLanguage(lang);
  }
  const captionSpecified = !!caption;
  const sourceSpecified = !!source;
  const captionBorderRadius = captionSpecified ? '0px' : '12px';

  let customActionButtonList = [];
  if (sourceSpecified) {
    customActionButtonList = [
      <IconButton aria-label="View full source in new tab" href={source}>
        <Tooltip
          triggerEvent="hover"
          align="bottom"
          justify="middle"
          trigger={
            <div css={sourceCodeStyle}>
              <Icon glyph="OpenNewTab" />
            </div>
          }
          darkMode={true}
          popoverZIndex={2}
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

        // Remove whitespace when copyable false
        > div > div {
          display: grid;
          grid-template-columns: ${!copyable && (languageOptions?.length === 0 || language === 'none')
            ? 'auto 0px !important'
            : 'code panel'};
        }

        > div {
          border-top-left-radius: ${captionBorderRadius};
          border-top-right-radius: ${captionBorderRadius};
          display: grid;
        }
      `}
    >
      {captionSpecified && (
        <div>
          <CaptionContainer style={{ '--border-color': darkMode ? palette.gray.dark2 : palette.gray.light2 }}>
            <Caption style={{ '--color': darkMode ? palette.gray.light2 : palette.gray.dark1 }}>{caption}</Caption>
          </CaptionContainer>
        </div>
      )}
      <CodeBlock
        copyable={copyable}
        highlightLines={emphasizeLines}
        language={language}
        languageOptions={languageOptions}
        darkMode={darkModeProp ?? darkMode}
        onChange={(selectedOption) => {
          const tabsetName = 'drivers';
          setActiveTab({ name: tabsetName, value: selectedOption.id });
        }}
        onCopy={reportCodeCopied}
        showLineNumbers={linenos}
        showCustomActionButtons={sourceSpecified}
        customActionButtons={customActionButtonList}
        lineNumberStart={lineno_start}
      >
        {code}
      </CodeBlock>
    </div>
  );
};

const CaptionContainer = styled.div`
  ${borderCodeStyle}
  border-color: var(--border-color);
  border-bottom: none;
  border-top-right-radius: 12px;
  border-top-left-radius: 12px;
`;

const Caption = styled.div`
  color: var(--color);
  padding: 10px;
  font-size: 14px;
  margin-left: 5px;
  border-bottom: none;
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
    lineno_start: PropTypes.number,
  }).isRequired,
};

export default Code;
