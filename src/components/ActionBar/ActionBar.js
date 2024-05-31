import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../theme/docsTheme';
import DarkModeDropdown from './DarkModeToggle';

const ActionBarContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  padding-top: ${theme.size.small};
  padding-bottom: ${theme.size.small};
  padding-right: ${theme.size.large};
  padding-left: ${theme.size.xlarge};
  width: 100%;
`;

const SearchBarPlacholder = styled('div')``;

const ActionsBox = styled('div')`
  display: flex;
  align-items: center;
  column-gap: ${theme.size.default};
`;

const ActionBar = ({ ...props }) => {
  return (
    <ActionBarContainer {...props}>
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
