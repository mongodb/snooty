import React, { useCallback, useMemo, useState } from 'react';
import { css, keyframes } from '@emotion/core';
import styled from '@emotion/styled';
import Button from '@leafygreen-ui/button';
import TextInput from '@leafygreen-ui/text-input';
import Icon from '@leafygreen-ui/icon';
import SearchDropdown from './SearchDropdown';

const GO_BUTTON_COLOR = '#E4F4F4';
const GO_BUTTON_SIZE = 24;

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

const StyledButton = styled(Button)`
  background-color: ${GO_BUTTON_COLOR};
  border-radius: ${GO_BUTTON_SIZE}px;
  height: ${GO_BUTTON_SIZE}px;
  position: absolute;
  right: 8px;
  top: 6px;
  width: ${GO_BUTTON_SIZE}px;
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

const SearchbarContainer = styled('div')`
  position: fixed;
  right: 16px;
  top: 5px;
  height: 36px;
  width: 372px;
  z-index: 10000;
  opacity: 0.6;
  :focus-within {
    opacity: 1;
    ${fadeInAnimation(0.6, '0.3s')};
  }
`;

const MagnifyingGlass = styled(Icon)`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
`;

const StyledTextInput = styled(TextInput)`
  /* Curve the text input box and put padding around text for icons/buttons */
  div > input {
    border-radius: 24px;
    padding-left: 32px;
    padding-right: 32px;
  }

  /* Remove blue border on focus */
  div > div:last-child {
    display: none;
  }
  > label {
    display: none;
  }
`;

const GoArrowIcon = styled(Icon)`
  left: 4px;
  position: absolute;
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
  const onBlur = useCallback(() => setBlurEvent(setTimeout(() => setIsFocused(false), 0)), []);
  return (
    <SearchbarContainer onBlur={onBlur} onFocus={onFocus}>
      <MagnifyingGlass glyph="MagnifyingGlass" fill="#061621" />
      <StyledTextInput tabIndex="0" placeholder="Search Documentation" value={value} onChange={onChange} label={null} />
      {!!value && <StyledButton href="#" glyph={<GoArrowIcon glyph="ArrowRight" fill="#13AA52" />}></StyledButton>}
      {isSearching && <SearchDropdown />}
    </SearchbarContainer>
  );
};

export default Searchbar;
