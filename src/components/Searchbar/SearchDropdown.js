import React from 'react';
import { css, keyframes } from '@emotion/core';
import styled from '@emotion/styled';

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

const SearchResultContainer = styled('div')`
  background-color: #ffffff;
  width: 100%;
  top: 16px;
  z-index: -1;
  position: absolute;
  border-radius: 0 0 4px 4px;
  opacity: 1;
  ${fadeInAnimation(0, '0.3s')};
`;

const SearchResults = styled('div')`
  box-shadow: 0 0 4px 0 rgba(184, 196, 194, 0.48);
  height: 368px;
  position: relative;
  width: 100%;
`;

const StyledSearchFooter = styled('div')`
  box-shadow: 0 0 4px 0 rgba(184, 196, 194, 0.64);
  height: 64px;
  position: relative;
  width: 100%;
`;

const SearchResultDropdownFooter = () => <StyledSearchFooter />;

const SearchDropdown = () => (
  <SearchResultContainer>
    <SearchResults />
    <SearchResultDropdownFooter />
  </SearchResultContainer>
);

export default SearchDropdown;
