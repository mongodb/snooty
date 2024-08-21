import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { SearchResultsMenu, SearchResult } from '@leafygreen-ui/search-input';
import { css, cx } from '@leafygreen-ui/emotion';
import { ModalView, MongoDbLegalDisclosure, PoweredByAtlasVectorSearch, useChatbotContext } from 'mongodb-chatbot-ui';
import PropTypes from 'prop-types';
import { suggestionStyling } from './styles';
import { SEARCH_SUGGESTIONS } from './SearchInput';

// Using a forward ref and imperative handle
// to expose lazy loaded child (chatbot) behaviors to parent (SearchInput)
// https://react.dev/reference/react/useImperativeHandle
const SearchMenu = forwardRef(function SearchMenu({ searchValue, searchBoxRef, isOpen, selectedOption }, ref) {
  const { handleSubmit, conversation } = useChatbotContext();
  const menuRef = useRef();
  const [chatbotAvailable, setChatbotAvailable] = useState(false);

  const handleSearchResultClick = useCallback(
    async (isChatbotRes) => {
      if (!isChatbotRes) {
        return (window.location.href = `https://mongodb.com/docs/search/?q=${searchValue}`);
      }
      return handleSubmit(searchValue);
    },
    [handleSubmit, searchValue]
  );

  useImperativeHandle(
    ref,
    () => {
      return {
        contains(el) {
          return menuRef.current?.contains(el);
        },
        async select(index) {
          return handleSearchResultClick(index === 1);
        },
      };
    },
    [handleSearchResultClick]
  );

  useEffect(() => {
    // on init, set a conversation id
    // workaround the chatbot bug of not having createConversation be async
    if (!isOpen || chatbotAvailable) {
      return;
    }
    const initConvo = async () => {
      await conversation.createConversation();
      setChatbotAvailable(!conversation.error);
    };
    if (!conversation.conversationId) initConvo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <>
      <SearchResultsMenu open={isOpen} refEl={searchBoxRef} ref={menuRef}>
        {SEARCH_SUGGESTIONS.slice(chatbotAvailable ? 0 : 1, 2).map((suggestion, i) => {
          const { copy } = suggestion;
          const isChatbot = i === 1;
          return (
            <SearchResult
              className={cx(suggestionStyling({ copy }))}
              key={`result-${i}`}
              id={`result-${i}`}
              onClick={async () => handleSearchResultClick(i === 1)}
              highlighted={selectedOption === i}
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
        })}
      </SearchResultsMenu>
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
});

export default SearchMenu;

SearchMenu.propTypes = {
  searchValue: PropTypes.string.isRequired,
  searchBoxRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.instanceOf(Element) })]),
  isOpen: PropTypes.bool,
  selectedOption: PropTypes.number,
};
