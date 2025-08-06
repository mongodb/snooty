import React from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import { ParentNode } from '../../types/ast';
import ComponentFactory from '../ComponentFactory';
import { theme } from '../../theme/docsTheme';

const MultiColumn = ({ nodeData }: { nodeData: ParentNode }) => {
  console.log('nodeData', nodeData);
  return (
    <div
      className={cx(css`
        display: flex;
        justify-content: space-between;
        gap: ${theme.size.xxlarge};
        margin-top: 60px;
        margin-bottom: 40px;

        @media ${theme.screenSize.upTo2XLarge} {
          flex-direction: column;
        }
      `)}
    >
      {nodeData.children.map((child, i) => {
        return <ComponentFactory nodeData={child} key={i} />;
      })}
    </div>
  );
};

export default MultiColumn;
