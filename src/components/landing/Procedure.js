import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import ComponentFactory from '../ComponentFactory';

const StyledProcedure = styled('div')`
  max-width: 500px;
  padding-left: ${({ theme }) => theme.size.large};
  @media ${({ theme }) => theme.screenSize.upToMedium} {
    padding-bottom: ${({ theme }) => theme.size.large};
  }
  @media ${({ theme }) => theme.screenSize.upToSmall} {
    padding-bottom: ${({ theme }) => theme.size.medium};
  }
`;

const Procedure = ({ nodeData: { children }, ...rest }) => {
  return (
    <StyledProcedure>
      {children.map((child, i) => (
        <ComponentFactory {...rest} nodeData={child} stepNumber={i + 1} key={i} />
      ))}
    </StyledProcedure>
  );
};

Procedure.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Procedure;
