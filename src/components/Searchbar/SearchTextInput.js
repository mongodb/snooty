import React, { useContext, useMemo } from 'react';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import TextInput from '@leafygreen-ui/text-input';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import { theme } from '../../theme/docsTheme';
import SearchContext from './SearchContext';

const SEARCHBAR_HEIGHT_OFFSET = '5px';

const StyledTextInput = styled(TextInput)`
  div > input {
    background-color: transparent;
    border: none;
    color: rgb(33, 49, 60);
    font-weight: 300;
    letter-spacing: 0.5px;
    :focus {
      border: none;
    }
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
    div > input {
      /* Always have this element filled in for mobile */
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

const SearchWrapper = styled('span')`
  width: 100%;
  @media ${theme.screenSize.upToSmall} {
    /* Putting this attribute on the input causes a DOM warning */
    ${({ isSearching }) => isSearching && `box-shadow: 0 2px 2px 0 rgba(231,238,236,0.2);`}
  }
`;

const SearchTextInput = React.forwardRef(({ isSearching, onChange, value, ...props }, ref) => {
  const { searchFilter, shouldAutofocus } = useContext(SearchContext);
  const { project } = useSiteMetadata();
  const placeholder = useMemo(
    () =>
      project === 'realm' && searchFilter === 'realm-master' ? 'Search Realm Documentation' : 'Search Documentation',
    [project, searchFilter]
  );
  return (
    <SearchWrapper isSearching={isSearching}>
      <StyledTextInput
        autoFocus={shouldAutofocus}
        label="Search Docs"
        onChange={onChange}
        placeholder={placeholder}
        ref={ref}
        tabIndex="0"
        value={value}
        {...props}
      />
    </SearchWrapper>
  );
});

// Also export the styled component for styled selector use
export { StyledTextInput };
export default SearchTextInput;
