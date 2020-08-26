import React from 'react';
import styled from '@emotion/styled';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import { uiColors } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';

// Defining as a styled component allows us to use as a selector in ExpandButton
const ExpandMagnifyingGlass = styled(Icon)``;

const ExpandButton = styled(IconButton)`
  background-color: #fff;
  background-image: none;
  border: none;
  border-radius: ${theme.size.medium};
  box-shadow: none;
  height: ${theme.size.large};
  position: absolute;
  right: ${theme.size.small};
  /* 32px button in a 36px container, 2px top gives equal spacing */
  top: 2px;
  width: ${theme.size.large};
  z-index: 1;
  :hover,
  :focus {
    background-color: #f7f9f8;
    ${ExpandMagnifyingGlass} {
      color: ${uiColors.gray.dark3};
      transition: color 150ms ease-in;
    }
  }
  :before {
    display: none;
  }
  :after {
    display: none;
  }
`;

const CondensedSearchbar = ({ onExpand }) => (
  <ExpandButton aria-label="Open MongoDB Docs Search" onClick={onExpand}>
    <ExpandMagnifyingGlass glyph="MagnifyingGlass" fill={uiColors.gray.base} />
  </ExpandButton>
);

export default CondensedSearchbar;
