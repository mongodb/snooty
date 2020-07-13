import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { css, keyframes } from '@emotion/core';
import styled from '@emotion/styled';
import Button from '@leafygreen-ui/button';
import Icon from '@leafygreen-ui/icon';
import { uiColors } from '@leafygreen-ui/palette';
import TextInput from '@leafygreen-ui/text-input';
import { theme } from '../../theme/docsTheme';
import SearchDropdown from './SearchDropdown';
import useScreenSize from '../../hooks/useScreenSize';

const GO_BUTTON_COLOR = uiColors.green.light3;
const GO_BUTTON_SIZE = theme.size.medium;
const SEARCHBAR_DESKTOP_WIDTH = 372;
const SEARCHBAR_HEIGHT = 36;

const GoArrowIcon = styled(Icon)`
  left: 4px;
  position: absolute;
`;

const GoButton = styled(Button)`
  background-color: ${GO_BUTTON_COLOR};
  border-radius: ${GO_BUTTON_SIZE};
  height: ${GO_BUTTON_SIZE};
  position: absolute;
  right: 8px;
  top: 6px;
  width: ${GO_BUTTON_SIZE};
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

const MagnifyingGlass = styled(Icon)`
  position: absolute;
  left: 10px;
  top: 10px;
  z-index: 1;
`;

const SearchbarContainer = styled('div')`
  height: ${SEARCHBAR_HEIGHT}px;
  opacity: 0.6;
  position: fixed;
  right: 16px;
  top: 5px;
  width: ${({ isExpanded }) => (isExpanded ? `${SEARCHBAR_DESKTOP_WIDTH}px` : '24px')};
  /* docs-tools navbar z-index is 9999 */
  z-index: 10000;
  transition: width 150ms ease-in, opacity 300ms ease-in-out;
  :focus-within {
    opacity: 1;
    transition: opacity 300ms ease-in-out;
  }
`;

const StyledTextInput = styled(TextInput)`
  /* Curve the text input box and put padding around text for icons/buttons */
  div > input {
    border-radius: ${theme.size.medium};
    padding-left: ${theme.size.large};
    padding-right: ${theme.size.large};
  }

  /* Remove blue border on focus */
  div > div:last-child {
    display: none;
  }
  > label {
    display: none;
  }
`;

const ExpandButton = styled(Button)`
  background-color: none;
  border-radius: ${GO_BUTTON_SIZE};
  height: ${GO_BUTTON_SIZE};
  position: absolute;
  right: 8px;
  top: 6px;
  width: ${GO_BUTTON_SIZE};
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

const ExpandMagnifyingGlass = styled(Icon)`
  position: absolute;
  left: 4px;
  top: 4px;
  z-index: 1;
`;

const Searchbar = () => {
  const [value, setValue] = useState('');
  const onChange = useCallback(e => setValue(e.target.value), []);
  const [blurEvent, setBlurEvent] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const { isMediumScreen } = useScreenSize();
  const [isExpanded, setIsExpanded] = useState(!isMediumScreen);
  useEffect(() => {
    setIsExpanded(!isMediumScreen);
  }, [isMediumScreen]);
  // A user is searching if the text input is focused and it is not empty
  const isSearching = useMemo(() => !!value && isFocused, [isFocused, value]);
  const onFocus = useCallback(() => {
    clearTimeout(blurEvent);
    setIsFocused(true);
  }, [blurEvent]);
  // The React onBlur event fires when tabbing between child elements
  const onBlur = useCallback(() => setBlurEvent(setTimeout(() => setIsFocused(false), 0)), []);
  return (
    <SearchbarContainer isMobile={isMediumScreen} isExpanded={isExpanded} onBlur={onBlur} onFocus={onFocus}>
      {isExpanded ? (
        <>
          <MagnifyingGlass glyph="MagnifyingGlass" fill={uiColors.black} />
          <StyledTextInput onChange={onChange} placeholder="Search Documentation" tabIndex="0" value={value} />
          {!!value && <GoButton href="#" glyph={<GoArrowIcon glyph="ArrowRight" fill="#13AA52" />} />}
          {isSearching && <SearchDropdown />}
        </>
      ) : (
        <ExpandButton onClick={() => setIsExpanded(true)}>
          <ExpandMagnifyingGlass glyph="MagnifyingGlass" fill={uiColors.gray.base} />
        </ExpandButton>
      )}
    </SearchbarContainer>
  );
};

export default Searchbar;
