import React from 'react';
import styled from '@emotion/styled';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';
import ChatbotUi from '../ChatbotUi';
import DarkModeDropdown from './DarkModeDropdown';

const ActionBarContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  padding-top: ${theme.size.small};
  padding-bottom: ${theme.size.small};
  padding-right: ${theme.size.large};
  width: 100%;
  position: sticky;
  top: 0;
  z-index: ${theme.zIndexes.header};
  background-color: ${(props) => (props.darkMode ? palette.black : palette.white)};
  border-bottom: 1px solid ${(props) => (props.darkMode ? palette.gray.dark2 : palette.gray.light2)};
`;

const ActionBarSearchContainer = styled.div`
  width: 80%;
`;

const ActionsBox = styled('div')`
  display: flex;
  align-items: center;
  column-gap: ${theme.size.default};
`;

const ActionBar = ({ ...props }) => {
  const { darkMode } = useDarkMode();
  return (
    <ActionBarContainer className={props.className} darkMode={darkMode}>
      <ActionBarSearchContainer>
        <ChatbotUi darkMode={darkMode} />
      </ActionBarSearchContainer>
      <ActionsBox>
        <DarkModeDropdown></DarkModeDropdown>
        <div>
          <button>Feedback</button>
        </div>
      </ActionsBox>
    </ActionBarContainer>
  );
};

ActionBar.propTypes = {};

export default ActionBar;
