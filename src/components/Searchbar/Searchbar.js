import React, { useCallback, useMemo, useState } from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import Button from '@leafygreen-ui/button';
import Icon from '@leafygreen-ui/icon';
import { uiColors } from '@leafygreen-ui/palette';
import TextInput from '@leafygreen-ui/text-input';
import useScreenSize from '../../hooks/useScreenSize';
import { theme } from '../../theme/docsTheme';
import SearchDropdown from './SearchDropdown';

const BUTTON_SIZE = theme.size.medium;
const GO_BUTTON_COLOR = uiColors.green.light3;
const SEARCHBAR_DESKTOP_WIDTH = 372;
const SEARCHBAR_HEIGHT = 36;
const SEARCHBAR_HEIGHT_OFFSET = '5px';

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

const GoButton = styled(Button)`
  ${commonSearchButtonStyling};
  background-color: ${GO_BUTTON_COLOR};
`;

const CloseButton = styled(Button)`
  ${commonSearchButtonStyling};
`;

const ExpandButton = styled(Button)`
  ${commonSearchButtonStyling};
`;

const ExpandMagnifyingGlass = styled(Icon)`
  /* This icon is 16px tall in a 24 px button, so 4px gives equal spacing */
  left: ${theme.size.tiny};
  top: ${theme.size.tiny};
  ${commonSearchIconStyling};
`;

const MagnifyingGlass = styled(Icon)`
  /* This icon is 16px tall in a 36px tall container, so 10px gives equal spacing */
  left: 10px;
  top: 10px;
  ${commonSearchIconStyling};
`;

const SearchbarContainer = styled('div')`
  height: ${SEARCHBAR_HEIGHT}px;
  opacity: 0.6;
  position: fixed;
  right: ${theme.size.default};
  top: ${SEARCHBAR_HEIGHT_OFFSET};
  transition: width 150ms ease-in, opacity 150ms ease-in;
  width: ${({ isExpanded }) => (isExpanded ? `${SEARCHBAR_DESKTOP_WIDTH}px` : BUTTON_SIZE)};
  /* docs-tools navbar z-index is 9999 */
  z-index: 10000;
  :focus-within,
  :hover {
    opacity: 1;
  }
  @media ${theme.screenSize.upToXSmall} {
    height: 100%;
    left: 0;
    opacity: 1;
    top: ${SEARCHBAR_HEIGHT_OFFSET};
    width: 100%;
  }
`;

const StyledTextInput = styled(TextInput)`
  /* Curve the text input box and put padding around text for icons/buttons */
  div > input {
    border-radius: ${theme.size.medium};
    padding-left: ${theme.size.large};
    padding-right: ${theme.size.large};
    :hover,
    :focus {
      border-color: ${uiColors.gray.light1};
      box-shadow: 0 0 ${theme.size.tiny} 0 rgba(184, 196, 194, 0.64);
    }
    @media ${theme.screenSize.upToXSmall} {
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

const Searchbar = ({ isExpanded, setIsExpanded }) => {
  const [value, setValue] = useState('');
  const onChange = useCallback(e => setValue(e.target.value), []);
  const { isMobile } = useScreenSize();
  const [blurEvent, setBlurEvent] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  // A user is searching if the text input is focused and it is not empty
  const isSearching = useMemo(() => !!value && isFocused, [isFocused, value]);
  const shouldShowGoButton = useMemo(() => !!value && !isMobile, [isMobile, value]);
  const onFocus = useCallback(() => {
    clearTimeout(blurEvent);
    setIsFocused(true);
  }, [blurEvent]);
  // The React onBlur event fires when tabbing between child elements
  const onBlur = useCallback(
    () =>
      setBlurEvent(
        setTimeout(() => {
          setIsFocused(false);
          setIsExpanded(!!value);
        }, 0)
      ),
    [setIsExpanded, value]
  );
  return (
    <SearchbarContainer isExpanded={isExpanded} onBlur={onBlur} onFocus={onFocus}>
      {isExpanded ? (
        <>
          <MagnifyingGlass glyph="MagnifyingGlass" fill={uiColors.black} />
          <StyledTextInput
            autoFocus
            label="Search Docs"
            isSearching={isSearching}
            onChange={onChange}
            placeholder="Search Documentation"
            tabIndex="0"
            type="search"
            value={value}
          />
          {shouldShowGoButton && (
            <GoButton aria-label="Go" href="#" glyph={<TextActionIcon glyph="ArrowRight" fill="#13AA52" />} />
          )}
          {isMobile && (
            <CloseButton
              aria-label="Close Search"
              onClick={() => setIsExpanded(false)}
              glyph={<TextActionIcon glyph="X" fill={uiColors.gray.base} />}
            />
          )}
          {isSearching && <SearchDropdown />}
        </>
      ) : (
        <ExpandButton aria-label="Open MongoDB Docs Search" onClick={() => setIsExpanded(true)}>
          <ExpandMagnifyingGlass glyph="MagnifyingGlass" fill={uiColors.gray.base} />
        </ExpandButton>
      )}
    </SearchbarContainer>
  );
};

export default Searchbar;
