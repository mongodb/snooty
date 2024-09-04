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
  flex-wrap: wrap;
  z-index: ${theme.zIndexes.actionBar};
  background-color: ${(props) => (props.darkMode ? palette.black : palette.white)};
  border-bottom: 1px solid ${(props) => (props.darkMode ? palette.gray.dark2 : palette.gray.light2)};

  @media ${theme.screenSize.mediumAndUp} {
    & > div {
      flex: 0 1 auto;
    }
  }

  @media ${theme.screenSize.upToMedium} {
    justify-content: space-between;
    padding-right: 0;
  }
`;

const ActionBarSearchContainer = styled.div`
  align-items: center;
  display: flex;
  width: 80%;

  @media ${theme.screenSize.upToMedium} {
    width: 100%;
  }

  @media ${theme.screenSize.upToSmall} {
    & > div {
      padding: ${theme.size.default} 32px;
    }
  }
`;

const ActionsBox = styled('div')`
  display: flex;
  align-items: center;
  column-gap: ${theme.size.default};

  @media ${theme.screenSize.upToMedium} {
    padding-left: 3rem;
  }

  @media ${theme.screenSize.upToSmall} {
    padding-left: 2rem;
  }
`;

// Note: When working on this component further, please check with design on how it should look in the errorpage template (404) as well!
const ActionBar = ({ template, ...props }) => {
  const { darkMode } = useDarkMode();
  return (
    <ActionBarContainer className={props.className} darkMode={darkMode}>
      <ActionBarSearchContainer>
        <ChatbotUi darkMode={darkMode} />
      </ActionBarSearchContainer>
      <ActionsBox>
        {template !== 'openapi' && <DarkModeDropdown />}
        {template !== 'errorpage' && (
          <div>
            <button>Feedback</button>
          </div>
        )}
      </ActionsBox>
    </ActionBarContainer>
  );
};

ActionBar.propTypes = {};

export default ActionBar;
