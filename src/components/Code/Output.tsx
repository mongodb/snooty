import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { default as CodeBlock } from '@leafygreen-ui/code';
import { palette } from '@leafygreen-ui/palette';
import { getLanguage } from '../../utils/get-language';
import { STRUCTURED_DATA_CLASSNAME, SoftwareSourceCodeSd } from '../../utils/structured-data';
import { usePageContext } from '../../context/page-context';
import { IOOutputNode } from '../../types/ast';

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
    border: initial;

    .dark-theme & {
      border: none;
    }
  }
  > div > div > pre {
    border: none;
    .dark-theme & {
      border: 1px solid ${palette.gray.dark2};
    }
    border-top: none;
  }
`;

const Output = ({ nodeData: { children } }: { nodeData: IOOutputNode }) => {
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
      <OutputContainer>
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

export default Output;
