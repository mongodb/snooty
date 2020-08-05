import React from 'react';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';

const HR = styled('hr')`
  border: 0.5px solid ${uiColors.gray.light2};
`;

const Transition = () => <HR />;

export default Transition;
