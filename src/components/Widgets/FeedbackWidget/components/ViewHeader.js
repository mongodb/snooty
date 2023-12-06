import React from 'react';
import styled from '@emotion/styled';
import { Body } from '@leafygreen-ui/typography';
import { theme } from '../../../../theme/docsTheme';

const TextHeader = styled(Body)`
  font-weight: 600;
  text-align: center;
  margin-top: 20px;

  @media ${theme.screenSize.upToLarge} {
    margin-top: ${theme.size.large};
  }
`;

// this should only render when in modal or mobile view
const ViewHeader = () => {
  return <TextHeader>How would you rate this page?</TextHeader>;
};

export default ViewHeader;
