import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import { SearchInput, SearchResult } from '@leafygreen-ui/search-input';
import { ModalView, useChatbotContext } from 'mongodb-chatbot-ui';
// import { theme } from '../../theme/docsTheme';
import debounce from '../../utils/debounce';

const PLACEHOLDER_TEXT = `Search MongoDB Docs or Ask MongoDB AI`;

const inputStyling = css`
  width: 100%;
  max-width: 610px;
`;

// using content before/after to prevent event bubbling up from lg/search-input/search-result
//
const suggestionStyling = ({ copy }) => css`
  & :before {
    content: '${copy} "';
  }

  & :after {
    content: '"';
  }

  svg {
    float: left;
  }
`;

const SearchBar = ({ className }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { openChat } = useChatbotContext();
  const SEARCH_SUGGESTIONS = useMemo(
    () => [
      { copy: 'Search', href: 'https://mongodb.com/docs/search/?q=' },
      {
        copy: 'Ask MongoDB AI',
        onClick: () => {
          openChat();
        },
        icon: <Icon glyph={'Sparkle'} />,
      },
    ],
    [openChat]
  );

  useEffect(() => {
    if (!searchValue.length) {
      return setIsOpen(false);
    }
    const debounced = debounce(() => {
      setIsOpen(searchValue.length > 0);
    }, 500);
    return debounced();
  }, [searchValue]);

  return (
    <>
      <SearchInput
        aria-label="Search MongoDB Docs"
        value={searchValue}
        placeholder={PLACEHOLDER_TEXT}
        className={cx(inputStyling, className)}
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
        usePortal={false}
      >
        {isOpen && searchValue.length
          ? SEARCH_SUGGESTIONS.map((suggestion, i) => {
              const { copy, icon } = suggestion;
              const suggestionProps = {};
              if (suggestion.href) {
                suggestionProps['href'] = suggestion.href + searchValue;
                suggestionProps['as'] = 'a';
              }
              if (suggestion.onClick) {
                suggestionProps['onClick'] = suggestion.onClick;
              }

              return (
                <SearchResult className={cx(suggestionStyling({ copy, icon }))} key={i} {...suggestionProps}>
                  {suggestion.icon}
                  {searchValue}
                </SearchResult>
              );
            })
          : undefined}
      </SearchInput>
      <ModalView
        inputBottomText={
          'This is an experimental generative AI chatbot. All information should be verified prior to use.'
        }
      />
    </>
  );
};

export default SearchBar;

SearchBar.propTypes = {
  className: PropTypes.string,
};
