import React, { useState, useContext, useEffect } from 'react';
import styled from '@emotion/styled';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { SearchInput } from '@leafygreen-ui/search-input';
import { Body } from '@leafygreen-ui/typography';
import Card from '@leafygreen-ui/card';
import Icon, { glyphs } from '@leafygreen-ui/icon';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';
import SearchContext from '../SearchResults/SearchContext';
// import ChatbotFab from '../Widgets/ChatbotWidget/ChatbotFab';
import { isBrowser } from '../../utils/is-browser';
import { SuspenseHelper } from '../SuspenseHelper';
import DarkModeDropdown from './DarkModeDropdown';

const ActionBarContainer = styled('div')`
  display: flex;
  justify-content: space-evenly;
  padding-top: ${theme.size.small};
  padding-bottom: ${theme.size.small};
  padding-right: ${theme.size.large};
  width: 100%;
  position: sticky;
  top: 0;
  flex-wrap: wrap;
  z-index: ${theme.zIndexes.header};
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
  position: relative;

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

const SearchOptionContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const CustomSearchInput = styled(SearchInput)`
  width: 647px;
`;

const CustomCard = styled(Card)`
  position: absolute;
  top: 50px;
  width: 100%;
`;

const SearchOptionButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
`;

const SearchOptionBody = styled(Body)`
  font-weight: 600;
  padding-left: 10px;
`;

// Note: When working on this component further, please check with design on how it should look in the errorpage template (404) as well!
const ActionBar = ({ template, ...props }) => {
  const { searchTerm, setSearchTerm } = useContext(SearchContext);

  const [searchField, setSearchField] = useState(searchTerm || '');
  const [activateSearchPopover, setActivateSearchPopover] = useState(false);
  const { darkMode } = useDarkMode();

  const deactivateSearchPopover = (event) => {
    // exclude the card popover itself
    const excludedElement = document.getElementById('search-option-popover');
    if (excludedElement && !excludedElement.contains(event.target)) {
      setActivateSearchPopover(false);
    }
  };

  useEffect(() => {
    if (isBrowser) {
      const mainContainer = document.getElementById('main-container');
      mainContainer.addEventListener('click', deactivateSearchPopover);

      return () => {
        mainContainer.removeEventListener('click', deactivateSearchPopover);
      };
    }
  }, []);

  const submitNewSearch = () => {
    const searchValue = searchField;
    const newValue = searchValue.replace(/^Search\s+"(.+)"$/, '$1');
    if (!newValue || newValue === searchTerm) {
      setActivateSearchPopover(false);
    }
    setSearchTerm(newValue);
    setActivateSearchPopover(false);
  };

  return (
    <SuspenseHelper fallback={null}>
      <ActionBarContainer className={props.className} darkMode={darkMode}>
        <ActionBarSearchContainer>
          <CustomSearchInput
            size="large"
            value={searchField}
            placeholder="Search"
            onSubmit={(e) => {
              submitNewSearch();
            }}
            onClick={() => {
              setActivateSearchPopover(true);
            }}
            onChange={(e) => {
              setSearchField(e.target.value);
            }}
          />
          {activateSearchPopover && (
            <CustomCard id="search-option-popover">
              <SearchOptionContainer>
                <SearchOptionButton
                  onClick={() => {
                    submitNewSearch();
                  }}
                >
                  <Icon fill={palette.green.dark1} glyph={glyphs.Sparkle.displayName} />
                  <SearchOptionBody>{searchField ? `Search "${searchField}"` : 'Search'}</SearchOptionBody>
                </SearchOptionButton>
                <SearchOptionButton>
                  <Icon fill={palette.green.dark1} glyph={glyphs.Sparkle.displayName} />
                  <SearchOptionBody css={{ color: palette.green.dark1, fontWeight: '400' }}>
                    {/* <ChatbotFab text={searchField ? `"${searchField}"` : ''} /> */}
                  </SearchOptionBody>
                </SearchOptionButton>
              </SearchOptionContainer>
            </CustomCard>
          )}
        </ActionBarSearchContainer>
        <ActionsBox>
          <DarkModeDropdown />
          {template !== 'errorpage' && (
            <div>
              <button>Feedback</button>
            </div>
          )}
        </ActionsBox>
      </ActionBarContainer>
    </SuspenseHelper>
  );
};

ActionBar.propTypes = {};

export default ActionBar;
