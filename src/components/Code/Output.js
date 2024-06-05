import React from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import { default as CodeBlock } from '@leafygreen-ui/code';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { palette } from '@leafygreen-ui/palette';
import { getLanguage } from '../../utils/get-language';

const Output = ({ nodeData: { children }, ...rest }) => {
  const { darkMode } = useDarkMode();
  const { emphasize_lines, value, linenos, lang, lineno_start } = children[0];
  const language = getLanguage(lang);

  return (
    <div
      css={css`
        > div > * {
          display: inline !important;
        }
        * {
          border-top-right-radius: 0px;
          border-top-left-radius: 0px;
          border-bottom-right-radius: 12px;
          border-bottom-left-radius: 12px;
        }

        /* Ensures no double border */
        > div {
          border: var(--code-container-border);
        }
        > div > div > pre {
          border: var(--code-pre-border);
          border-top: var(--code-pre-border-top);
        }
      `}
      style={
        darkMode
          ? {
              '--code-container-border': 'none',
              '--code-pre-border': `1px solid ${palette.gray.dark2}`,
              '--code-pre-border-top': 'none',
            }
          : {
              '--code-container-border': 'auto',
              '--code-pre-border': `none`,
              '--code-pre-border-top': 'none',
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
    </div>
  );
};

Output.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Output;
