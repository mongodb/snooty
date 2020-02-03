import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { fontSize, size } from './theme';

/**
 *
 * @param {Object.string} param
 *  @param {string} bold should be bold weight
 *  @param {string} collapse should be if the margin is to be removed
 */
const variants = ({ bold, collapse }) =>
  css`
    font-weight: ${bold ? 'bold' : 'normal'};
    margin: ${collapse && 0};
  `;

const bottomMargin = css`
  margin: 0 0 ${size.default} 0;
`;

export const H1 = styled('h1')`
  ${bottomMargin};
  font-size: ${fontSize.h1};
  ${variants};
`;
export const H2 = styled('h2')`
  ${bottomMargin};
  font-size: ${fontSize.h2};
  ${variants};
`;
export const H3 = styled('h3')`
  ${bottomMargin};
  font-size: ${fontSize.h3};
  ${variants};
`;
export const H4 = styled('h4')`
  ${bottomMargin};
  font-size: ${fontSize.h4};
  ${variants};
`;

export const P = styled('p')`
  ${bottomMargin};
  ${variants};
`;
