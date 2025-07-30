import React from 'react';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import ComponentFactory from '../ComponentFactory';
import { theme } from '../../theme/docsTheme';
import { FigureProps } from '.';

const Caption = styled('p')`
  color: ${palette.gray.dark1};
  /* TODO: Remove !important when mongodb-docs.css is removed */
  margin-top: ${theme.size.default} !important;
  text-align: center;

  /* TODO: Remove when mongodb-docs.css is removed */
  & > code {
    color: ${palette.gray.dark1};
  }
`;

const CaptionLegend = ({ nodeData: { children }, ...rest }: FigureProps) => (
  <>
    {children.length > 0 && (
      <Caption>
        <ComponentFactory {...rest} nodeData={children[0]} parentNode="caption" />
      </Caption>
    )}
    {children.length > 1 && (
      <>
        {children.slice(1).map((child, index) => (
          <ComponentFactory {...rest} key={index} nodeData={child} />
        ))}
      </>
    )}
  </>
);

export default CaptionLegend;
