import React from 'react';
import PropTypes from 'prop-types';
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

const ChapterNumberLabel = ({ className, number }) => {
  return <Label className={className}>Chapter {number}</Label>;
};

ChapterNumberLabel.propTypes = {
  className: PropTypes.string,
  number: PropTypes.number.isRequired,
};

export default ChapterNumberLabel;
