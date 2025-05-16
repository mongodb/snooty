import React from 'react';
import { css } from '@emotion/react';
import { Directive } from '../types/ast';
import ComponentFactory from './ComponentFactory';

const Describe = ({ nodeData: { argument, children }, ...rest }: { nodeData: Directive }) => (
  <dl>
    <dt>
      <code
        // @ts-ignore
        css={css`
          /* TODO: Remove when mongodb-docs.css is removed */
          font-weight: normal;
        `}
      >
        {argument.map((arg, i) => (
          <ComponentFactory {...rest} key={i} nodeData={arg} />
        ))}
      </code>
    </dt>
    <dd>
      {children.map((child, i) => (
        <ComponentFactory {...rest} key={i} nodeData={child} />
      ))}
    </dd>
  </dl>
);

export default Describe;
