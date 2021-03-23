import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Overline } from '@leafygreen-ui/typography';
import { uiColors } from '@leafygreen-ui/palette';
import ComponentFactory from '../ComponentFactory';

const StyledKicker = styled(Overline)`
  color: ${uiColors.gray.dark1};
  padding-top: 80px;
  font-size: ${({ theme }) => theme.fontSize.small};
`;

const Kicker = ({ nodeData: { argument }, ...rest }) => (
  <StyledKicker>
    {argument.map((child, i) => (
      <ComponentFactory {...rest} nodeData={child} key={i} />
    ))}
  </StyledKicker>
);

Kicker.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Kicker;
