import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const StyledTOCCode = styled('code')`
  font-family: 'Source Code Pro';
  color: #333;
`;

const TOCCodeNode = ({ nodeData: { children } }) => <StyledTOCCode>{children[0].value}</StyledTOCCode>;

TOCCodeNode.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default TOCCodeNode;
