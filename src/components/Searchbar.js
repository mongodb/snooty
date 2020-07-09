import React, { useCallback, useMemo, useState } from 'react';
import { css, keyframes } from '@emotion/core';
import styled from '@emotion/styled';
import Button from '@leafygreen-ui/button';
import TextInput from '@leafygreen-ui/text-input';
import Icon from '@leafygreen-ui/icon';

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
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: ${seconds};
`;

const StyledButton = styled(Button)`
  position: absolute;
  top: 6px;
  right: 8px;
  z-index: 1;
  background-color: #e4f4e4;
  border-radius: 24px;
  height: 24px;
  width: 24px;
  background-image: none;
  border: none;
  border-image-width: 0;
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
  z-index: 99999;
  opacity: 0.6;
  :focus-within {
    opacity: 1;
    ${fadeInAnimation(0.6, '0.3s')};
  }
`;

const StyledIcon = styled(Icon)`
  position: absolute;
  z-index: 100000;
  top: 10px;
  left: 10px;
`;

const StyledTextInput = styled(TextInput)`
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

const SearchResultContainer = styled('div')`
  background-color: #ffffff;
  width: 100%;
  top: 16px;
  z-index: -1;
  position: absolute;
  border-radius: 0 0 4px 4px;
  opacity: 1;
  ${fadeInAnimation('0', '0.3s')};
`;

const SearchResults = styled('div')`
  box-shadow: 0 0 4px 0 rgba(184, 196, 194, 0.48);
  width: 100%;
  height: 368px;
  position: relative;
`;

const StyledSearchFooter = styled('div')`
  position: relative;
  height: 64px;
  width: 100%;
  box-shadow: 0 0 4px 0 rgba(184, 196, 194, 0.64);
`;

const ArrowIcon = styled(Icon)`
  position: absolute;
  left: 4px;
`;

const SearchResultDropdownFooter = () => <StyledSearchFooter />;

const SearchDropdown = () => (
  <SearchResultContainer>
    <SearchResults />
    <SearchResultDropdownFooter />
  </SearchResultContainer>
);

const Searchbar = () => {
  const [value, setValue] = useState('');
  const onChange = useCallback(e => setValue(e.target.value), []);
  const [isFocused, setIsFocused] = useState(false);
  // A user is searching if the text input is focused and it is not empty
  const isSearching = useMemo(() => !!value && isFocused, [isFocused, value]);
  return (
    <SearchbarContainer onBlur={() => setIsFocused(false)} onFocus={() => setIsFocused(true)}>
      <StyledIcon glyph="MagnifyingGlass" fill="#061621" />
      <StyledTextInput placeholder="Search Documentation" value={value} onChange={onChange} label={null} />
      {!!value && <StyledButton href="#" glyph={<ArrowIcon glyph="ArrowRight" fill="#13AA52" />}></StyledButton>}
      {isSearching && <SearchDropdown />}
    </SearchbarContainer>
  );
};

export default Searchbar;
