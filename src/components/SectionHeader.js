import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Body } from '@leafygreen-ui/typography';

const CustomStyleHeader = styled(Body)`
  color: #061621;
  font-size: 24px;
  font-weight: 500;
  margin: 0;
`;

const SectionHeader = ({ as = 'h1', children }) => {
  return <CustomStyleHeader as={as}>{children}</CustomStyleHeader>;
};

SectionHeader.prototype = {
  as: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
};

export default SectionHeader;
