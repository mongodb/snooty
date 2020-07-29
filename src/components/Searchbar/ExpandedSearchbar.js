import React, { useCallback, useMemo, useState } from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import IconButton from '@leafygreen-ui/icon-button';
import Icon from '@leafygreen-ui/icon';
import { uiColors } from '@leafygreen-ui/palette';
import useScreenSize from '../../hooks/useScreenSize';
import SearchTextInput from './SearchTextInput';
import { theme } from '../../theme/docsTheme';

const CLOSE_BUTTON_SIZE = theme.size.medium;
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
  left: 2px;
  top: 2px;
  height: 12px;
  position: absolute;
  width: 12px;
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

const ExpandedSearchbar = ({ isFocused, onMobileClose, onChange }) => {
  const [value, setValue] = useState('');
  const { isMobile } = useScreenSize();
  const shouldShowGoButton = useMemo(() => !!value && !isMobile, [isMobile, value]);
  const isSearching = useMemo(() => !!value && isFocused, [isFocused, value]);

  const onSearchQueryChange = useCallback(
    e => {
      const searchTerm = e.target.value;
      setValue(searchTerm);
      onChange(searchTerm);
    },
    [onChange]
  );

  return (
    <>
      <MagnifyingGlass glyph="MagnifyingGlass" />
      <SearchTextInput isSearching={isSearching} onChange={onSearchQueryChange} value={value} />
      {shouldShowGoButton && (
        <GoButton aria-label="Go" href="#">
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

export { MagnifyingGlass };
export default ExpandedSearchbar;
