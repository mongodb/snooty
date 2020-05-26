import React from 'react';
// import styled from '@emotion/styled';
import { css } from '@emotion/core';
import ComponentFactory from '../ComponentFactory';
const Introduction = ({ nodeData: { children }, ...rest }) => (
  <div
    css={css`
      grid-column-start: 1;
      justify-self: start;
    `}
  >
    {children.map((child, i) => (
      <ComponentFactory nodeData={child} key={i} {...rest} />
    ))}
  </div>
);

export default Introduction;
