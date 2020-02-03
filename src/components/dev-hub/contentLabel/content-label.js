import React from 'react';
import styled from '@emotion/styled';
import { P } from '../text';
import { colorMap } from '../theme';

/* TODO: Update font once decided */
const ContentLabelText = styled(P)`
  background: ${colorMap.greyDarkThree};
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 1px;
  padding: 5px 10px;
  ${({ textColor }) => textColor && `color: ${textColor};`}
  text-transform: uppercase;
  width: fit-content;
`;

const ContentLabel = ({ text, textColor }) => {
  return <ContentLabelText textColor={textColor}>{text}</ContentLabelText>;
};

export default ContentLabel;
