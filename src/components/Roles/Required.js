import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';

const Em = styled('em')`
  color: ${uiColors.red.base};
  font-size: ${({ theme }) => `${theme.fontSize.default}`};
  font-weight: normal !important;
`;

const RoleRequired = ({ nodeData: { target } }) => <Em>required</Em>;

RoleRequired.propTypes = {
  nodeData: PropTypes.shape({
    target: PropTypes.bool.isRequired,
  }).isRequired,
};

export default RoleRequired;
