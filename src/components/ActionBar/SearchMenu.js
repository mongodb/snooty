import React, { forwardRef, useCallback, useImperativeHandle } from 'react';
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
  const { setInputText, handleSubmit, openChat } = useChatbotContext();

  const handleSearchResultClick = useCallback(
    async (isChatbotRes) => {
      if (!isChatbotRes) {
        return (window.location.href = `https://mongodb.com/docs/search/?q=${searchValue}`);
      }
      await openChat();
      setInputText(searchValue);
      handleSubmit(searchValue);
    },
    [handleSubmit, openChat, searchValue, setInputText]
  );
  useImperativeHandle(
    ref,
    () => {
      return {
        contains(el) {
          return searchBoxRef.current?.contains(el);
        },
        select(index) {
          return handleSearchResultClick(index === 1);
        },
      };
    },
    [handleSearchResultClick, searchBoxRef]
  );

  return (
    <>
      <SearchResultsMenu open={isOpen} refEl={searchBoxRef} ref={ref}>
        {SEARCH_SUGGESTIONS.map((suggestion, i) => {
          const { copy } = suggestion;
          const isChatbot = i === 1;
          return (
            <SearchResult
              className={cx(suggestionStyling({ copy }))}
              key={`result-${i}`}
              id={`result-${i}`}
              onClick={() => {
                handleSearchResultClick(i === 1);
              }}
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
