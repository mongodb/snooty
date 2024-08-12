import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ModalView, useChatbotContext } from 'mongodb-chatbot-ui';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { SearchInput, SearchResult } from '@leafygreen-ui/search-input';
import { InlineCode } from '@leafygreen-ui/typography';
import { theme } from '../../theme/docsTheme';
import debounce from '../../utils/debounce';
import { isBrowser } from '../../utils/is-browser';
import { SparkleIcon } from './SparkIcon';

const PLACEHOLDER_TEXT = `Search MongoDB Docs or Ask MongoDB AI`;

const inputStyling = css`
  width: 100%;
  max-width: 610px;
`;

// using content before/after to prevent event bubbling up from lg/search-input/search-result
// https://github.com/mongodb/leafygreen-ui/blob/%40leafygreen-ui/search-input%402.1.4/packages/search-input/src/SearchInput/SearchInput.tsx#L155
const suggestionStyling = ({ copy }) => css`
  & > div:before {
    content: '${copy} "';
  }

  & > div:after {
    content: '"';
  }

  svg {
    float: left;
    margin-right ${theme.size.tiny};
  }

  padding: ${theme.fontSize.tiny} ${theme.size.medium};

  & code { 
    float: right;
    color: ${palette.gray.dark1};
    border-radius: ${theme.size.medium};
    line-height: inherit;
    padding: 0 6px;
  }
`;

const SearchBar = ({ className }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const shortcutKeyPressed = useRef(false);
  const { openChat, handleSubmit } = useChatbotContext();
  const SEARCH_SUGGESTIONS = useMemo(
    () => [
      {
        copy: 'Search',
        onClick: async () => {
          if (shortcutKeyPressed.current) {
            await openChat();
            return handleSubmit(searchValue);
          }
          console.log('redirecting');
          window.location.href = `https://mongodb.com/docs/search/?q=${searchValue}`;
        },
      },
      {
        copy: 'Ask MongoDB AI',
        onClick: async () => {
          await openChat();
          handleSubmit(searchValue);
        },
        icon: <SparkleIcon glyph={'Sparkle'} />,
        shortcutIcon: <InlineCode>&#8984;K</InlineCode>,
      },
    ],
    [handleSubmit, searchValue, openChat]
  );

  const keyPressHandler = useCallback((event) => {
    if (navigator.userAgent.includes('Mac') && event.key === 'Meta') {
      shortcutKeyPressed.current = event.type === 'keydown';
    } else if (event.key === 'Control') {
      shortcutKeyPressed.current = event.type === 'keydown';
    }
  }, []);

  useEffect(() => {
    if (!searchValue.length) {
      return setIsOpen(false);
    }
    const debounced = debounce(() => {
      setIsOpen(searchValue.length > 0);
    }, 500);
    return debounced();
  }, [searchValue]);

  useEffect(() => {
    if (!isBrowser) return;
    document.addEventListener('keydown', keyPressHandler);
    document.addEventListener('keyup', keyPressHandler);
    return () => {
      document.removeEventListener('keydown', keyPressHandler);
      document.addEventListener('keyup', keyPressHandler);
    };
  }, [keyPressHandler]);

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
                <SearchResult
                  className={cx('search-result', suggestionStyling({ copy, icon }))}
                  key={i}
                  {...suggestionProps}
                >
                  {suggestion.icon}
                  {searchValue}
                  {suggestion.shortcutIcon}
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
