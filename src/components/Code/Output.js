import React from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import { default as CodeBlock } from '@leafygreen-ui/code';

const Output = ({ nodeData: { children }, ...rest }) => {
  const { emphasize_lines, value, linenos, lang, lineno_start } = children[0];
  const language = lang || 'none';
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
      `}
    >
      <CodeBlock
        highlightLines={emphasize_lines}
        language={language}
        showLineNumbers={linenos}
        darkMode={true}
        copyable={false}
        linenos={linenos}
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
