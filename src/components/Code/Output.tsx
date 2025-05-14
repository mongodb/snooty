import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { default as CodeBlock } from '@leafygreen-ui/code';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { palette } from '@leafygreen-ui/palette';
import { getLanguage } from '../../utils/get-language';
import { STRUCTURED_DATA_CLASSNAME, SoftwareSourceCodeSd } from '../../utils/structured-data';
import { usePageContext } from '../../context/page-context';

const OutputContainer = styled.div`
  > div > * {
    display: inline !important;
  }
  style {
    display: none !important;
  }
  * {
    border-top-right-radius: 0px;
    border-top-left-radius: 0px;
    border-bottom-right-radius: 12px;
    border-bottom-left-radius: 12px;
  }

  /* Fixes border differences with dark mode and normal codeblock */
  > div {
    border: var(--code-container-border);
  }
  > div > div > pre {
    border: var(--code-pre-border);
    border-top: none;
  }
`;

const Output = ({ nodeData: { children } }) => {
  const { darkMode } = useDarkMode();
  const { emphasize_lines, value, linenos, lang, lineno_start } = children[0];
  const language = getLanguage(lang);
  const { slug } = usePageContext();
  const softwareSourceCodeSd = useMemo(() => {
    const sd = new SoftwareSourceCodeSd({ code: value, lang, slug });
    return sd.isValid() ? sd.toString() : undefined;
  }, [value, lang, slug]);

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
      <OutputContainer
        style={
          darkMode
            ? {
                '--code-container-border': 'none',
                '--code-pre-border': `1px solid ${palette.gray.dark2}`,
              }
            : {
                '--code-container-border': 'initial',
                '--code-pre-border': `none`,
              }
        }
      >
        <CodeBlock
          highlightLines={emphasize_lines}
          language={language}
          showLineNumbers={linenos}
          darkMode={true}
          copyable={false}
          lineNumberStart={lineno_start}
        >
          {value}
        </CodeBlock>
      </OutputContainer>
    </>
  );
};

Output.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Output;
