import React from 'react';
import { css } from '@emotion/react';
import { Directive } from '../types/ast';
import ComponentFactory from './ComponentFactory';

const rubricStyle = css`
  font-weight: 700;
`;

const Rubric = ({ nodeData: { argument }, ...rest }: { nodeData: Directive }) => (
  // @ts-ignore
  <p css={rubricStyle}>
    {argument.map((node, i) => (
      <ComponentFactory {...rest} key={i} nodeData={node} />
    ))}
  </p>
);

export default Rubric;
