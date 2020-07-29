import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import TextInput from '@leafygreen-ui/text-input';
import { theme } from '../../theme/docsTheme';

const SEARCHBAR_HEIGHT_OFFSET = '5px';

const activeTextBarStyling = css`
  background-color: #fff;
  border: none;
  color: ${uiColors.gray.dark3};
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
    transition: background-color 150ms ease-in;
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
    div > input {
      /* Always have this element filled in for mobile */
      ${activeTextBarStyling}
      /* Switching font size on mobile allows us to prevent iOS Safari from zooming in */
      font-size: ${theme.fontSize.default};
      padding-top: 2px;
    }
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

const SearchTextInput = ({ isSearching, onChange, value, ...props }) => (
  <StyledTextInput
    autoFocus
    label="Search Docs"
    isSearching={isSearching}
    onChange={onChange}
    placeholder="Search Documentation"
    tabIndex="0"
    value={value}
    {...props}
  />
);

// Also export the styled component for styled selector use
export { activeTextBarStyling, StyledTextInput };
export default SearchTextInput;
