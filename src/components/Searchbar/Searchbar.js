import React, { useCallback, useMemo, useState } from 'react';
import { css, keyframes } from '@emotion/core';
import styled from '@emotion/styled';
import Button from '@leafygreen-ui/button';
import Icon from '@leafygreen-ui/icon';
import { uiColors } from '@leafygreen-ui/palette';
import TextInput from '@leafygreen-ui/text-input';
import { theme } from '../../theme/docsTheme';
import SearchDropdown from './SearchDropdown';

const GO_BUTTON_COLOR = uiColors.green.light3;
const GO_BUTTON_SIZE = theme.size.medium;
const SEARCHBAR_DESKTOP_WIDTH = 372;
const SEARCHBAR_HEIGHT = 36;

const animationKeyframe = startingOpacity => keyframes`
    0% {
      opacity: ${startingOpacity};
    }
    100% {
      opacity: 1;
    }
`;

const fadeInAnimation = (startingOpacity, seconds) => css`
  animation: ${animationKeyframe(startingOpacity)};
  animation-duration: ${seconds};
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
`;

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
  width: ${SEARCHBAR_DESKTOP_WIDTH}px;
  /* docs-tools navbar z-index is 9999 */
  z-index: 10000;
  :focus-within {
    opacity: 1;
    ${fadeInAnimation(0.6, '0.3s')};
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

const Searchbar = () => {
  const [value, setValue] = useState('');
  const onChange = useCallback(e => setValue(e.target.value), []);
  const [blurEvent, setBlurEvent] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  // A user is searching if the text input is focused and it is not empty
  const isSearching = useMemo(() => !!value && isFocused, [isFocused, value]);
  const onFocus = useCallback(() => {
    clearTimeout(blurEvent);
    setIsFocused(true);
  }, [blurEvent]);
  // The React onBlur event fires when tabbing between child elements
  const onBlur = useCallback(() => setBlurEvent(setTimeout(() => setIsFocused(false), 0)), []);
  return (
    <SearchbarContainer onBlur={onBlur} onFocus={onFocus}>
      <MagnifyingGlass glyph="MagnifyingGlass" fill="#061621" />
      <StyledTextInput onChange={onChange} placeholder="Search Documentation" tabIndex="0" value={value} />
      {!!value && <GoButton href="#" glyph={<GoArrowIcon glyph="ArrowRight" fill="#13AA52" />} />}
      {isSearching && <SearchDropdown />}
    </SearchbarContainer>
  );
};

export default Searchbar;
