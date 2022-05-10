import React from 'react';
import PropTypes from 'prop-types';
import { default as CodeBlock } from '@leafygreen-ui/code';
import { cx, css } from '@leafygreen-ui/emotion';

const outputCodeStyle = css`
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  border-top-right-radius: 0px;
  border-top-left-radius: 0px;
`;

const Output = ({ nodeData: { children }, ...rest }) => {
  const { emphasize_lines, value, linenos, lang, lineno_start } = children[0];
  const language = lang || 'none';
  return (
    <CodeBlock
      className={cx(outputCodeStyle)}
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
  );
};

Output.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Output;
