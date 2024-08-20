import React, { lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { SearchInput as LGSearchInput, SearchResult } from '@leafygreen-ui/search-input';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { theme } from '../../theme/docsTheme';
import debounce from '../../utils/debounce';
import { isBrowser } from '../../utils/is-browser';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import { SuspenseHelper } from '../SuspenseHelper';
import { ShortcutIcon, SparkleIcon } from './SparkIcon';

// lazy load chatbot components
const Chatbot = lazy(() => import('mongodb-chatbot-ui'));
const ChatbotSearchContent = lazy(() => import('./ChatbotSearchContent'));
const ModalView = lazy(() => import('mongodb-chatbot-ui').then((module) => ({ default: module.ModalView })));
const MongoDbLegalDisclosure = lazy(() =>
  import('mongodb-chatbot-ui').then((module) => ({ default: module.MongoDbLegalDisclosure }))
);
const PoweredByAtlasVectorSearch = lazy(() =>
  import('mongodb-chatbot-ui').then((module) => ({ default: module.PoweredByAtlasVectorSearch }))
);

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
const suggestionStyling = ({ copy, isChatbot, chatbotAvailable }) => css`
  ${isChatbot && !chatbotAvailable && 'display: none;'}
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
  const [chatbotAvailable, setChatbotAvailable] = useState(false);
  const shortcutKeyPressed = useRef(false);
  const chatbotRef = useRef(null);
  const metadata = useSnootyMetadata();
  const { darkMode } = useDarkMode();

  const SEARCH_SUGGESTIONS = useMemo(
    () => [
      {
        copy: 'Search',
      },
      {
        copy: 'Ask MongoDB AI',
        icon: <SparkleIcon glyph={'Sparkle'} />,
        shortcutIcon: <ShortcutIcon width={30} height={18} />,
      },
    ],
    []
  );

  const handleSearchResultClick = (isChatbotRes) => {
    if (isChatbotRes) {
      return chatbotRef.current.onClick();
    }
    window.location.href = `https://mongodb.com/docs/search/?q=${searchValue}`;
  };

  useEffect(() => {
    if (!searchValue.length) {
      return setIsOpen(false);
    }
    const debounced = debounce(() => {
      setIsOpen(searchValue.length > 0);
    }, 500);
    return () => debounced();
  }, [searchValue]);

  const keyPressHandler = useCallback((event) => {
    if ((navigator.userAgent.includes('Mac') && event.key === 'Meta') || event.key === 'Control') {
      shortcutKeyPressed.current = event.type === 'keydown';
    }
  }, []);

  useEffect(() => {
    if (!isBrowser) return;
    document.addEventListener('keydown', keyPressHandler);
    document.addEventListener('keyup', keyPressHandler);
    return () => {
      document.removeEventListener('keydown', keyPressHandler);
      document.addEventListener('keyup', keyPressHandler);
    };
  }, [keyPressHandler]);

  const CHATBOT_SERVER_BASE_URL =
    metadata?.snootyEnv === 'dotcomprd'
      ? 'https://knowledge.mongodb.com/api/v1'
      : 'https://knowledge.staging.corp.mongodb.com/api/v1';

  return (
    <div className={cx(inputStyling, className)}>
      <SuspenseHelper
        fallback={
          <LGSearchInput
            aria-label="Search MongoDB Docs"
            value={searchValue}
            placeholder={PLACEHOLDER_TEXT}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          ></LGSearchInput>
        }
      >
        <Chatbot serverBaseUrl={CHATBOT_SERVER_BASE_URL} darkMode={darkMode}>
          <LGSearchInput
            aria-label="Search MongoDB Docs"
            value={searchValue}
            placeholder={PLACEHOLDER_TEXT}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          >
            {isOpen && searchValue.length
              ? SEARCH_SUGGESTIONS.map((suggestion, i) => {
                  const { copy } = suggestion;
                  const isChatbot = i === 1;
                  return (
                    <SearchResult
                      className={cx(suggestionStyling({ copy, isChatbot, chatbotAvailable }))}
                      key={i}
                      onClick={() => {
                        handleSearchResultClick(i === 1);
                      }}
                    >
                      {!isChatbot && <>{searchValue}</>}
                      {isChatbot && (
                        <ChatbotSearchContent
                          ref={chatbotRef}
                          searchValue={searchValue}
                          setChatbotAvailable={setChatbotAvailable}
                        >
                          {suggestion.icon}
                          {searchValue}
                          {suggestion.shortcutIcon}
                        </ChatbotSearchContent>
                      )}
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
        </Chatbot>
      </SuspenseHelper>
    </div>
  );
};

export default SearchInput;

SearchInput.propTypes = {
  className: PropTypes.string,
};
