import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Wrapper = styled('div')`
  max-width: 100vw;
  min-height: 600px;
`;

const OpenAPITemplate = ({ children }) => <Wrapper>{children}</Wrapper>;

OpenAPITemplate.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
};

export default OpenAPITemplate;
