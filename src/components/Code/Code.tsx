import { css } from '@emotion/react';
import React, { useCallback, useContext, useMemo } from 'react';
import styled from '@emotion/styled';
import { default as CodeBlock } from '@leafygreen-ui/code';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import Tooltip from '@leafygreen-ui/tooltip';
import { palette } from '@leafygreen-ui/palette';
import { TabContext } from '../Tabs/tab-context';
import { reportAnalytics } from '../../utils/report-analytics';
import { getLanguage } from '../../utils/get-language';
import { DRIVER_ICON_MAP, DriverMap } from '../icons/DriverIconMap';
import { STRUCTURED_DATA_CLASSNAME, SoftwareSourceCodeSd } from '../../utils/structured-data';
import { usePageContext } from '../../context/page-context';
import { OFFLINE_CONTAINER_CLASSNAME } from '../../utils/head-scripts/offline-ui/code';
import { isOfflineDocsBuild } from '../../utils/is-offline-docs-build';
import { CodeNode } from '../../types/ast';
import { baseCodeStyle, borderCodeStyle, lgStyles } from './styles/codeStyle';
import { CodeContext, LanguageOption } from './code-context';

const sourceCodeStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Returns the icon associated with the driver language that would be
// shown on our TabSelector component
const getDriverImage = (driver: string, driverIconMap: DriverMap) => {
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
  nodeData: { caption, emphasize_lines: emphasizeLines, lang, linenos, value, source, lineno_start },
}: {
  nodeData: CodeNode;
}) => {
  const copyable = false;
  const { setActiveTab } = useContext(TabContext);
  const { languageOptions, codeBlockLanguage } = useContext(CodeContext);
  const { slug } = usePageContext();
  const code = value;
  let language = (languageOptions?.length > 0 && codeBlockLanguage) || getLanguage(lang);

  const driverIconMap = DRIVER_ICON_MAP;

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

  let customActionButtonList: JSX.Element[] = [];

  if (isOfflineDocsBuild) {
    // LG/button renders copy button on state change. need to add custom button
    // https://github.com/mongodb/leafygreen-ui/blob/%40leafygreen-ui/code%4014.3.3/packages/code/src/Code/Code.tsx#L78

    customActionButtonList.push(
      <IconButton aria-label="Copy">
        <Icon glyph={'Copy'} />
      </IconButton>
    );
  }
  if (sourceSpecified) {
    customActionButtonList.push(
      <IconButton aria-label="View full source in new tab" href={source}>
        <Tooltip
          triggerEvent="hover"
          align="bottom"
          justify="middle"
          trigger={
            // @ts-ignore
            <div css={sourceCodeStyle}>
              <Icon glyph="OpenNewTab" />
            </div>
          }
          darkMode={true}
          popoverZIndex={2}
        >
          View full source
        </Tooltip>
      </IconButton>
    );
  }

  const reportCodeCopied = useCallback(() => {
    reportAnalytics('CodeblockCopied', { code });
  }, [code]);

  const softwareSourceCodeSd = useMemo(() => {
    const sd = new SoftwareSourceCodeSd({ code, lang, slug });
    return sd.isValid() ? sd.toString() : undefined;
  }, [code, lang, slug]);

  return (
    <>
      {softwareSourceCodeSd && (
        <script
          className={STRUCTURED_DATA_CLASSNAME}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: softwareSourceCodeSd,
          }}
        />
      )}
      <div
        className={isOfflineDocsBuild ? OFFLINE_CONTAINER_CLASSNAME : undefined}
        // @ts-ignore
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
            border-color: ${palette.gray.light2};

            .dark-theme & {
              border-color: ${palette.gray.dark2};
            }
          }

          pre {
            background-color: ${palette.gray.light3};
            color: ${palette.black};

            .dark-theme & {
              background-color: ${palette.black};
              color: ${palette.gray.light3};
            }
          }

          [data-testid='leafygreen-code-panel'] {
            background-color: ${palette.white};
            border-color: ${palette.gray.light2};

            .dark-theme & {
              background-color: ${palette.gray.dark2};
              border-color: ${palette.gray.dark2};
            }
          }

          ${lgStyles}
        `}
      >
        {captionSpecified && (
          <div>
            <CaptionContainer>
              <Caption>{caption}</Caption>
            </CaptionContainer>
          </div>
        )}
        <CodeBlock
          copyable={copyable}
          highlightLines={emphasizeLines}
          language={language}
          languageOptions={languageOptions}
          onChange={(selectedOption) => {
            setActiveTab({ drivers: (selectedOption as LanguageOption).id });
          }}
          onCopy={reportCodeCopied}
          showLineNumbers={linenos}
          showCustomActionButtons={customActionButtonList.length > 0}
          customActionButtons={customActionButtonList}
          lineNumberStart={lineno_start}
        >
          {code}
        </CodeBlock>
      </div>
    </>
  );
};

const CaptionContainer = styled.div`
  ${borderCodeStyle}
  border-bottom: none;
  border-top-right-radius: 12px;
  border-top-left-radius: 12px;
  border-color: ${palette.gray.light2};

  .dark-theme & {
    border-color: ${palette.gray.dark2};
  }
`;

const Caption = styled.div`
  padding: 10px;
  font-size: 14px;
  margin-left: 5px;
  border-bottom: none;

  color: ${palette.gray.dark1};

  .dark-theme & {
    color: ${palette.gray.light2};
  }
`;

export default Code;
