import React, { useCallback, useMemo, useState, useRef } from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import Button from '@leafygreen-ui/button';
import Icon from '@leafygreen-ui/icon';
import { uiColors } from '@leafygreen-ui/palette';
import TextInput from '@leafygreen-ui/text-input';
import useScreenSize from '../../hooks/useScreenSize';
import SearchContext from './SearchContext';
import { useClickOutside } from '../../hooks/use-click-outside';
import { theme } from '../../theme/docsTheme';
import SearchDropdown from './SearchDropdown';

const BUTTON_SIZE = theme.size.medium;
const GO_BUTTON_COLOR = uiColors.green.light3;
const GO_BUTTON_SIZE = '20px';
const NUMBER_SEARCH_RESULTS = 9;
const SEARCH_DELAY_TIME = 200;
const SEARCHBAR_DESKTOP_WIDTH = 372;
const SEARCHBAR_HEIGHT = 36;
const SEARCHBAR_HEIGHT_OFFSET = '5px';
const TRANSITION_SPEED = '150ms';

const commonSearchButtonStyling = css`
  background-color: #fff;
  border-radius: ${BUTTON_SIZE};
  height: ${BUTTON_SIZE};
  position: absolute;
  right: ${theme.size.small};
  /* button is 24 px and entire container is 36px so 6px top gives equal spacing */
  top: 6px;
  width: ${BUTTON_SIZE};
  z-index: 1;
  /* Below removes default hover effects from button */
  background-image: none;
  border: none;
  box-shadow: none;
  :before {
    display: none;
  }
  :after {
    display: none;
  }
`;

const commonSearchIconStyling = css`
  position: absolute;
  z-index: 1;
`;

const TextActionIcon = styled(Icon)`
  left: ${theme.size.tiny};
  position: absolute;
`;

const GoIcon = styled(Icon)`
  /* Go Button size is 20px, 5px gives equal width on each size */
  left: 5px;
  position: absolute;
  height: 10px;
  width: 10px;
`;

const GoButton = styled(Button)`
  ${commonSearchButtonStyling};
  background-color: ${GO_BUTTON_COLOR};
  right: ${theme.size.default};
  border-radius: ${GO_BUTTON_SIZE};
  height: ${GO_BUTTON_SIZE};
  padding: 0;
  position: absolute;
  /* button is 20 px and entire container is 36px so 8px top gives equal spacing */
  top: ${theme.size.small};
  width: ${GO_BUTTON_SIZE};
`;

const CloseButton = styled(Button)`
  ${commonSearchButtonStyling};
`;

const ExpandMagnifyingGlass = styled(Icon)`
  /* This icon is 16px tall in a 32 px button, so 8px gives equal spacing */
  left: ${theme.size.small};
  top: ${theme.size.small};
  ${commonSearchIconStyling};
`;

const ExpandButton = styled(Button)`
  ${commonSearchButtonStyling};
  height: ${theme.size.large};
  width: ${theme.size.large};
  /* 32px button in a 36px container, 2px top gives equal spacing */
  top: 2px;
  :hover,
  :focus {
    background-color: #f7f9f8;
    ${ExpandMagnifyingGlass} {
      color: ${uiColors.gray.dark3};
      transition: color ${TRANSITION_SPEED} ease-in;
    }
  }
`;

const StyledTextInput = styled(TextInput)`
  /* Curve the text input box and put padding around text for icons/buttons */
  div > input {
    border: none;
    background-color: ${uiColors.gray.light3};
    border-radius: ${theme.size.medium};
    color: ${uiColors.gray.dark1};
    /* 24 px for magnifying glass plus 16px margin */
    padding-left: 40px;
    padding-right: ${theme.size.large};
    font-weight: 300;
    letter-spacing: 0.5px;
    transition: background-color ${TRANSITION_SPEED} ease-in;
    ::placeholder {
      color: ${uiColors.gray.dark1};
    }
    @media ${theme.screenSize.upToSmall} {
      border: none;
      :hover,
      :focus {
        border: none;
        box-shadow: none;
      }
    }
  }

  /* Remove blue border on focus */
  div > div:last-child {
    display: none;
  }
  > label {
    display: none;
  }

  @media ${theme.screenSize.upToSmall} {
    background-color: #fff;
    padding-bottom: ${theme.size.tiny};
    ${({ isSearching }) => isSearching && `box-shadow: 0 2px 2px 0 rgba(231,238,236,0.2);`};
    /**
    On mobile, there is some space above the searchbar that is uncovered (on
      desktop this is taken care of by the navbar). Here we can block elements
      below from peeking through with a pseudoelement to cover this top space
    */
    :before {
      background-color: #fff;
      bottom: 100%;
      content: '';
      position: absolute;
      top: -${SEARCHBAR_HEIGHT_OFFSET};
      width: 100%;
    }
  }
`;

const MagnifyingGlass = styled(Icon)`
  color: ${uiColors.gray.base};
  left: ${theme.size.default};
  /* This icon is 16px tall in a 36px tall container, so 10px gives equal spacing */
  top: 10px;
  transition: color ${TRANSITION_SPEED} ease-in;
  ${commonSearchIconStyling};
`;

const SearchbarContainer = styled('div')`
  height: ${SEARCHBAR_HEIGHT}px;
  position: fixed;
  right: ${theme.size.default};
  top: ${SEARCHBAR_HEIGHT_OFFSET};
  transition: width ${TRANSITION_SPEED} ease-in;
  width: ${({ isExpanded }) => (isExpanded ? `${SEARCHBAR_DESKTOP_WIDTH}px` : BUTTON_SIZE)};
  /* docs-tools navbar z-index is 9999 */
  z-index: 10000;
  :hover,
  :focus,
  :focus-within {
    ${MagnifyingGlass} {
      color: ${uiColors.gray.dark3};
    }
    ${StyledTextInput} {
      div > input {
        background-color: #fff;
        border: none;
        box-shadow: 0 0 ${theme.size.tiny} 0 rgba(184, 196, 194, 0.56);
        color: ${uiColors.gray.dark3};
        transition: background-color ${TRANSITION_SPEED} ease-in, color ${TRANSITION_SPEED} ease-in;
        @media ${theme.screenSize.upToSmall} {
          box-shadow: none;
        }
      }
    }
  }
  @media ${theme.screenSize.upToSmall} {
    height: ${({ isExpanded, isSearching }) => (isExpanded && isSearching ? '100%' : `${SEARCHBAR_HEIGHT}px`)};
    left: 0;
    top: ${SEARCHBAR_HEIGHT_OFFSET};
    width: 100%;
    ${StyledTextInput} {
      div > input {
        /* Switching font size on mobile allows us to prevent iOS Safari from zooming in */
        font-size: ${theme.fontSize.default};
      }
    }
  }
`;

const Searchbar = ({ getResultsFromJSON, isExpanded, setIsExpanded, searchParamsToURL }) => {
  const [value, setValue] = useState('');
  const { isMobile } = useScreenSize();
  const [searchEvent, setSearchEvent] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef(null);

  // A user is searching if the text input is focused and it is not empty
  const isSearching = useMemo(() => !!value && isFocused, [isFocused, value]);
  const shouldShowGoButton = useMemo(() => !!value && !isMobile, [isMobile, value]);
  const onFocus = useCallback(() => setIsFocused(true), []);
  const onBlur = useCallback(() => {
    setIsFocused(false);
    setIsExpanded(false);
  }, [setIsExpanded]);
  const onSearchChange = useCallback(
    e => {
      const enteredValue = e.target.value;
      setValue(enteredValue);
      setIsFocused(true);
      // Debounce any queued search event since the query has changed
      clearTimeout(searchEvent);
      if (enteredValue) {
        // Set a timeout to trigger the search to avoid over-requesting
        setSearchEvent(
          setTimeout(async () => {
            const result = await fetch(searchParamsToURL(enteredValue, {}));
            const resultJson = await result.json();
            setSearchResults(getResultsFromJSON(resultJson, NUMBER_SEARCH_RESULTS));
          }, SEARCH_DELAY_TIME)
        );
      }
    },
    [getResultsFromJSON, searchEvent, searchParamsToURL]
  );
  // Close the dropdown and remove focus when clicked outside
  useClickOutside(ref, onBlur);
  return (
    <SearchContext.Provider value={value}>
      <SearchbarContainer isSearching={isSearching} isExpanded={isExpanded} onFocus={onFocus} ref={ref}>
        {isExpanded ? (
          <>
            <MagnifyingGlass glyph="MagnifyingGlass" />
            <StyledTextInput
              autoFocus
              label="Search Docs"
              isSearching={isSearching}
              onChange={onSearchChange}
              placeholder="Search Documentation"
              tabIndex="0"
              value={value}
            />
            {shouldShowGoButton && (
              <GoButton aria-label="Go" href="#" glyph={<GoIcon glyph="ArrowRight" fill="#13AA52" />} />
            )}
            {isMobile && (
              <CloseButton
                aria-label="Close Search"
                onClick={() => setIsExpanded(false)}
                glyph={<TextActionIcon glyph="X" fill={uiColors.gray.base} />}
              />
            )}
            {isSearching && <SearchDropdown results={searchResults} />}
          </>
        ) : (
          <ExpandButton aria-label="Open MongoDB Docs Search" onClick={() => setIsExpanded(true)}>
            <ExpandMagnifyingGlass glyph="MagnifyingGlass" fill={uiColors.gray.base} />
          </ExpandButton>
        )}
      </SearchbarContainer>
    </SearchContext.Provider>
  );
};

export default Searchbar;
