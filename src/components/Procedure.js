import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { theme } from '../theme/docsTheme';
import ComponentFactory from './ComponentFactory';

const StyledProcedure = styled('div')`
  ${({ procedureStyle }) =>
    procedureStyle === 'connected' &&
    `
    @media ${theme.screenSize.upToLarge} {
      padding-bottom: ${theme.size.large};
    }
    @media ${theme.screenSize.upToSmall} {
      padding-bottom: ${theme.size.medium};
    }
  `}
`;

const Procedure = ({ nodeData: { children, options }, ...rest }) => {
  // Make the style 'connected' by default for now to give time for PLPs that use this directive to
  // add the "style" option
  const style = options?.style || 'connected';

  return (
    <StyledProcedure procedureStyle={style}>
      {children.map((child, i) => (
        <ComponentFactory
          {...rest}
          nodeData={child}
          stepNumber={i + 1}
          style={style}
          isLastStep={i === children.length - 1}
          key={i}
        />
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
