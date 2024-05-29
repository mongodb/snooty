import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { Label } from '../Select';
import { DarkModeContext } from '../../context/dark-mode-context';

const List = styled('ul')`
  list-style-type: none;
  padding: 0;
`;

const StyledLabel = styled(Label)`
  font-weight: 500;
  color: ${({ darkMode }) => (!darkMode ? palette.gray.dark1 : palette.gray.light1)};
`;

const ContentsList = ({ children, label }) => {
  const { darkMode } = useContext(DarkModeContext);

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
