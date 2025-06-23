import React from 'react';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';

const Label = styled('div')`
  background-color: ${palette.green.light3};
  border-radius: ${theme.size.tiny};
  color: ${palette.black};

  .dark-theme & {
    background-color: ${palette.blue.dark3};
    color: ${palette.blue.light2};
  }
  font-size: ${theme.fontSize.small};
  font-weight: bold;
  line-height: ${theme.size.medium};
  height: ${theme.size.medium};
  text-align: center;
  width: 83px;
`;

export type ChapterNumberLabelProps = {
  className: string;
  number: number;
};

const ChapterNumberLabel = ({ className, number }: ChapterNumberLabelProps) => {
  return <Label className={className}>Chapter {number}</Label>;
};

export default ChapterNumberLabel;
