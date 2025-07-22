import React from 'react';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';

const HR = styled('hr')`
  border: 0.5px solid ${palette.gray.light2};
`;

const Transition = () => <HR />;

export default Transition;
