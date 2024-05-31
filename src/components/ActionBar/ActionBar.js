import React from 'react';
import styled from '@emotion/styled';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';
import DarkModeDropdown from './DarkModeDropdown';

const ActionBarContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  padding-top: ${theme.size.small};
  padding-bottom: ${theme.size.small};
  padding-right: ${theme.size.large};
  padding-left: ${theme.size.xlarge};
  width: 100%;
  position: sticky;
  top: 0;
  z-index: ${theme.zIndexes.header};
  background-color: ${(props) => (props.darkMode ? palette.black : palette.white)};
  border-bottom: 1px solid ${(props) => (props.darkMode ? palette.gray.dark2 : palette.gray.light2)};
`;

const SearchBarPlacholder = styled('div')``;

const ActionsBox = styled('div')`
  display: flex;
  align-items: center;
  column-gap: ${theme.size.default};
`;

const ActionBar = ({ ...props }) => {
  const { darkMode } = useDarkMode();
  return (
    <ActionBarContainer className={props.className} darkMode={darkMode}>
      <SearchBarPlacholder>
        <input placeholder="This will be search chatbot"></input>
      </SearchBarPlacholder>
      <ActionsBox>
        <DarkModeDropdown></DarkModeDropdown>
        Feedback Button here
      </ActionsBox>
    </ActionBarContainer>
  );
};

ActionBar.propTypes = {};

export default ActionBar;
