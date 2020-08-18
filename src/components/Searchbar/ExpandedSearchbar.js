import React, { useCallback, useContext, useMemo, useRef } from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import { uiColors } from '@leafygreen-ui/palette';
import useScreenSize from '../../hooks/useScreenSize';
import { theme } from '../../theme/docsTheme';
import SearchTextInput from './SearchTextInput';
import { searchParamsToURL } from '../../utils/search-params-to-url';
import SearchContext from './SearchContext';

const CLOSE_BUTTON_SIZE = theme.size.medium;
const ENTER_KEY = 13;
const GO_BUTTON_COLOR = uiColors.green.light3;
const GO_BUTTON_SIZE = '20px';

const removeDefaultHoverEffects = css`
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

const CloseButton = styled(IconButton)`
  background-color: #fff;
  border-radius: ${CLOSE_BUTTON_SIZE};
  height: ${CLOSE_BUTTON_SIZE};
  position: absolute;
  right: ${theme.size.small};
  /* button is 24 px and entire container is 36px so 6px top gives equal spacing */
  top: 6px;
  width: ${CLOSE_BUTTON_SIZE};
  z-index: 1;
  ${removeDefaultHoverEffects};
`;

const GoButton = styled(IconButton)`
  background-color: ${GO_BUTTON_COLOR};
  border-radius: ${GO_BUTTON_SIZE};
  height: ${GO_BUTTON_SIZE};
  padding: 0;
  position: absolute;
  right: ${theme.size.default};
  /* button is 20 px and entire container is 36px so 8px top gives equal spacing */
  top: ${theme.size.small};
  width: ${GO_BUTTON_SIZE};
  z-index: 1;
  ${removeDefaultHoverEffects};
`;

const GoIcon = styled(Icon)`
  /* Icon box size is 16px, 3px gives equal width and height */
  left: 3px;
  top: 3px;
  height: 10px;
  position: absolute;
  width: 10px;
`;

const MagnifyingGlass = styled(Icon)`
  color: ${uiColors.gray.base};
  left: ${theme.size.default};
  position: absolute;
  /* This icon is 16px tall in a 36px tall container, so 10px gives equal spacing */
  top: 10px;
  transition: color 150ms ease-in;
  z-index: 1;
`;

const ExpandedSearchbar = ({ isFocused, onChange, onMobileClose }) => {
  const { isMobile } = useScreenSize();
  const { searchTerm, searchFilter } = useContext(SearchContext);
  const isSearching = useMemo(() => !!searchTerm && isFocused, [isFocused, searchTerm]);
  const shouldShowGoButton = useMemo(() => !!searchTerm && !isMobile, [isMobile, searchTerm]);

  const onSearchChange = useCallback(
    e => {
      const searchTerm = e.target.value;
      onChange(searchTerm);
    },
    [onChange]
  );

  const searchUrl = useMemo(() => searchParamsToURL(searchTerm, searchFilter, false), [searchFilter, searchTerm]);

  const goButton = useRef(null);
  // On an "Enter", click the Go button
  const onKeyDown = useCallback(e => {
    if (e.key === 'Enter' || e.keyCode === ENTER_KEY) {
      goButton && goButton.current && goButton.current.click();
    }
  }, []);

  return (
    <>
      <MagnifyingGlass glyph="MagnifyingGlass" />
      <SearchTextInput onKeyDown={onKeyDown} isSearching={isSearching} onChange={onSearchChange} value={searchTerm} />
      {shouldShowGoButton && (
        <GoButton ref={goButton} type="submit" aria-label="Go" href={searchUrl}>
          <GoIcon glyph="ArrowRight" fill="#13AA52" />
        </GoButton>
      )}
      {isMobile && (
        <CloseButton aria-label="Close Search" onClick={onMobileClose}>
          <Icon glyph="X" fill={uiColors.gray.base} />
        </CloseButton>
      )}
    </>
  );
};

// Export this icon to be used as a selector by a parent component
export { MagnifyingGlass };
export default ExpandedSearchbar;
