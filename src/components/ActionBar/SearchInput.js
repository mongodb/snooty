import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ModalView, MongoDbLegalDisclosure, PoweredByAtlasVectorSearch, useChatbotContext } from 'mongodb-chatbot-ui';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { SearchInput as LGSearchInput, SearchResult } from '@leafygreen-ui/search-input';
import { theme } from '../../theme/docsTheme';
import debounce from '../../utils/debounce';
import { isBrowser } from '../../utils/is-browser';
import { ShortcutIcon, SparkleIcon } from './SparkIcon';

const PLACEHOLDER_TEXT = `Search MongoDB Docs or Ask MongoDB AI`;

const inputStyling = css`
  width: 100%;
  max-width: 610px;

  > div[role='searchbox'] {
    background-color: var(--search-input-background-color);
  }

  --search-input-background-color: ${palette.white};
  .dark-theme & {
    --search-input-background-color: ${palette.gray.dark4};
  }
`;

// using content before/after to prevent event bubbling up from lg/search-input/search-result
// package above gets all text inside node, and sets the value of Input node of all text within search result:
// https://github.com/mongodb/leafygreen-ui/blob/%40leafygreen-ui/search-input%402.1.4/packages/search-input/src/SearchInput/SearchInput.tsx#L149-L155
const suggestionStyling = ({ copy }) => css`
  & > div:before {
    content: '${copy} "';
  }

  & > div:after {
    content: '"';
  }

  svg:first-of-type {
    float: left;
    margin-right: ${theme.size.tiny};
  }

  padding: ${theme.fontSize.tiny} ${theme.size.medium};

  svg:last-of-type {
    float: right;
  }
`;

const SearchInput = ({ className }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const shortcutKeyPressed = useRef(false);
  const { setInputText, handleSubmit, conversation } = useChatbotContext();

  const createConversation = useCallback(async () => {
    try {
      await conversation.createConversation();
    } catch (e) {
      console.error('Chatbot not available: ', e);
    }
  }, [conversation]);

  const handleClick = useCallback(
    async (open) => {
      setInputText(searchValue);
      if (!conversation.conversationId) {
        await createConversation();
      }
      if (open) {
        return handleSubmit(searchValue);
      }
      window.location.href = `https://mongodb.com/docs/search/?q=${searchValue}`;
    },
    [conversation.conversationId, createConversation, handleSubmit, searchValue, setInputText]
  );

  const SEARCH_SUGGESTIONS = useMemo(
    () => [
      {
        copy: 'Search',
        onClick: async () => {
          handleClick(shortcutKeyPressed.current);
        },
      },
      {
        copy: 'Ask MongoDB AI',
        onClick: async () => {
          handleClick(true);
        },
        icon: <SparkleIcon glyph={'Sparkle'} />,
        shortcutIcon: <ShortcutIcon width={30} height={18} />,
      },
    ],
    [handleClick]
  );

  const keyPressHandler = useCallback((event) => {
    if ((navigator.userAgent.includes('Mac') && event.key === 'Meta') || event.key === 'Control') {
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
    return () => debounced();
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
      <LGSearchInput
        aria-label="Search MongoDB Docs"
        value={searchValue}
        placeholder={PLACEHOLDER_TEXT}
        className={cx(inputStyling, className)}
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
        onFocus={() => {
          if (!conversation.conversationId) {
            createConversation();
          }
        }}
      >
        {isOpen && searchValue.length
          ? SEARCH_SUGGESTIONS.map((suggestion, i) => {
              const { copy, icon, onClick } = suggestion;

              return (
                <SearchResult className={cx(suggestionStyling({ copy, icon }))} key={i} onClick={onClick}>
                  {suggestion.icon}
                  {searchValue}
                  {suggestion.shortcutIcon}
                </SearchResult>
              );
            })
          : undefined}
      </LGSearchInput>
      <ModalView
        inputBottomText={
          'This is an experimental generative AI chatbot. All information should be verified prior to use.'
        }
        disclaimer={
          <>
            <MongoDbLegalDisclosure />
            <PoweredByAtlasVectorSearch
              linkStyle="text"
              className={css`
                margin-top: 8px;
              `}
            />
          </>
        }
      />
    </>
  );
};

export default SearchInput;

SearchInput.propTypes = {
  className: PropTypes.string,
};
