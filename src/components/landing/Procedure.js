import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from '../ComponentFactory';
import styled from '@emotion/styled';

const StyledProcedure = styled('div')`
  max-width: 400px;
  padding-top: ${({ theme }) => theme.size.default};
  padding-left: ${({ theme }) => theme.size.small};
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
