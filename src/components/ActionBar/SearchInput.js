import React, { lazy, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@leafygreen-ui/emotion';
import { SearchInput as LGSearchInput, SearchResult } from '@leafygreen-ui/search-input';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import debounce from '../../utils/debounce';
import { isBrowser } from '../../utils/is-browser';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import { SuspenseHelper } from '../SuspenseHelper';
import { inputStyling, suggestionStyling } from './styles';
import { ShortcutIcon, SparkleIcon } from './SparkIcon';

// lazy load chatbot components
const Chatbot = lazy(() => import('mongodb-chatbot-ui'));
const ChatbotControls = lazy(() => import('./ChatbotControls'));
const ModalView = lazy(() => import('mongodb-chatbot-ui').then((module) => ({ default: module.ModalView })));
const MongoDbLegalDisclosure = lazy(() =>
  import('mongodb-chatbot-ui').then((module) => ({ default: module.MongoDbLegalDisclosure }))
);
const PoweredByAtlasVectorSearch = lazy(() =>
  import('mongodb-chatbot-ui').then((module) => ({ default: module.PoweredByAtlasVectorSearch }))
);

const PLACEHOLDER_TEXT = `Search MongoDB Docs or Ask MongoDB AI`;

const SEARCH_SUGGESTIONS = [
  {
    copy: 'Search',
  },
  {
    copy: 'Ask MongoDB AI',
    icon: <SparkleIcon glyph={'Sparkle'} />,
    shortcutIcon: <ShortcutIcon width={30} height={18} />,
  },
];

const SearchInput = ({ className }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const chatbotRef = useRef(null);
  const inputRef = useRef();

  const metadata = useSnootyMetadata();
  const { darkMode } = useDarkMode();

  const handleSearchResultClick = useCallback(
    (isChatbotRes) => {
      if (isChatbotRes) {
        return chatbotRef.current?.onClick();
      }
      window.location.href = `https://mongodb.com/docs/search/?q=${searchValue}`;
    },
    [searchValue]
  );

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
    // cmd+k or ctrl+k focuses search bar,
    // unless already focused on an input field
    const holdingCtrlCmd = (navigator.userAgent.includes('Mac') && event.metaKey) || event.ctrlKey;
    if (holdingCtrlCmd && event.key === 'k' && document.activeElement.tagName.toLowerCase() !== 'input') {
      event.preventDefault();
      inputRef.current?.focus();
      return;
    }

    // if currently focused on search input,
    // activates the chatbot modal
    if (event.target.isSameNode(inputRef.current) && event.key === '/') {
      event.preventDefault();
      return chatbotRef.current?.onClick();
    }
  }, []);

  // adding keyboard shortcuts document wide
  useEffect(() => {
    if (!isBrowser) return;
    document.addEventListener('keydown', keyPressHandler);
    return () => {
      document.removeEventListener('keydown', keyPressHandler);
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
            disabled={true}
            value={searchValue}
            placeholder={PLACEHOLDER_TEXT}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            ref={inputRef}
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
            ref={inputRef}
          >
            {isOpen && searchValue.length
              ? SEARCH_SUGGESTIONS.map((suggestion, i) => {
                  const { copy } = suggestion;
                  const isChatbot = i === 1;
                  return (
                    <SearchResult
                      className={cx(suggestionStyling({ copy }))}
                      key={i}
                      onClick={() => {
                        handleSearchResultClick(isChatbot);
                      }}
                    >
                      {!isChatbot && <>{searchValue}</>}
                      {isChatbot && (
                        <>
                          {suggestion.icon}
                          {searchValue}
                          {suggestion.shortcutIcon}
                        </>
                      )}
                    </SearchResult>
                  );
                })
              : undefined}
          </LGSearchInput>

          <ChatbotControls ref={chatbotRef} searchValue={searchValue} />
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
