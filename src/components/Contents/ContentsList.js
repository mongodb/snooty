import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Label } from '../Select';
import { palette } from '@leafygreen-ui/palette';

const List = styled('ul')`
  list-style-type: none;
  padding: 0;
`;

const StyledLabel = styled(Label)`
  font-weight: 500;
  color: ${palette.gray.dark1};
`;

const ContentsList = ({ children, label }) => {
  return (
    <>
      <StyledLabel>{label}</StyledLabel>
      <List>{children}</List>
    </>
  );
};

ContentsList.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
};

export default ContentsList;
