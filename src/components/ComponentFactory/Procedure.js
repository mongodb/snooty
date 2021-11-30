import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { theme } from '../../theme/docsTheme';
import ComponentFactory from './index';

const StyledProcedure = styled('div')`
  max-width: 500px;
  padding-left: ${theme.size.large};
  @media ${theme.screenSize.upToLarge} {
    padding-bottom: ${theme.size.large};
  }
  @media ${theme.screenSize.upToSmall} {
    padding-bottom: ${theme.size.medium};
  }
`;

const Procedure = ({ nodeData: { children }, ...rest }) => (
  <StyledProcedure>
    {children.map((child, i) => (
      <ComponentFactory {...rest} nodeData={child} stepNumber={i + 1} key={i} />
    ))}
  </StyledProcedure>
);

Procedure.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Procedure;
