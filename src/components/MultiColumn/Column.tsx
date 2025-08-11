import React from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import { H3 } from '@leafygreen-ui/typography';
import { ColumnNode } from '../../types/ast';
import ComponentFactory from '../ComponentFactory';

const Column = ({ nodeData: { children, options } }: { nodeData: ColumnNode }) => {
  return (
    <div
      className={cx(css`
        flex: 1;

        ul {
          list-style: none;
          padding-left: 24px;
          margin: 0;
          position: relative;

          li {
            &::before {
              content: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4.25" stroke="%2300ED64" stroke-width="1.9"/></svg>');
              position: absolute;
              left: -10px;
              transform: translateY(20%);
            }
          }
        }
      `)}
    >
      {options?.title && (
        <H3
          className={cx(css`
            color: #fff;
            margin-bottom: 37px;
          `)}
        >
          {options.title}
        </H3>
      )}
      {children.map((child, i) => (
        <ComponentFactory nodeData={child} key={i} removeMargin={true} />
      ))}
    </div>
  );
};

export default Column;
