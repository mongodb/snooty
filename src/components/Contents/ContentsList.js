import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { Label } from '../Select';

const List = styled('ul')`
  list-style-type: none;
  padding: 0;
`;

const StyledLabel = styled(Label)`
  font-weight: 500;
  color: ${({ darkMode }) => (!darkMode ? palette.gray.dark1 : palette.gray.light1)};
`;

const ContentsList = ({ children, label }) => {
  const { darkMode } = useDarkMode();

  return (
    <>
      <StyledLabel darkMode={darkMode}>{label}</StyledLabel>
      <List>{children}</List>
    </>
  );
};

ContentsList.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
};

export default ContentsList;
