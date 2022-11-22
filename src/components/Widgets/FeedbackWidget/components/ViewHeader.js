import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../../../theme/docsTheme';

const TextHeader = styled('h3')`
  font-weight: 600;
  font-size: ${theme.fontSize.default};
  text-align: center;
  margin-top: 24px;
  margin-bottom: 32px;
  display: flex;
  align-items: flex-end;
`;

// this should only render when in modal or mobile view
const ViewHeader = () => {
  return <TextHeader>Did this page help?</TextHeader>;
};

export default ViewHeader;
