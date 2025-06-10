import React from 'react';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';

const Em = styled('em')`
  color: ${palette.red.base};
  font-size: ${({ theme }) => `${theme.fontSize.default}`};
  font-weight: normal !important;
`;

const RoleRequired = () => <Em>required</Em>;

export default RoleRequired;
