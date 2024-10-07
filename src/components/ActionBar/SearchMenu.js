import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { navigate } from 'gatsby';
import { SearchResultsMenu, SearchResult } from '@leafygreen-ui/search-input';
import { css, cx } from '@leafygreen-ui/emotion';
import { ModalView, MongoDbLegalDisclosure, PoweredByAtlasVectorSearch, useChatbotContext } from 'mongodb-chatbot-ui';
import PropTypes from 'prop-types';
import { useAllDocsets } from '../../hooks/useAllDocsets';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import { assertTrailingSlash } from '../../utils/assert-trailing-slash';
import { getCurrLocale, localizePath } from '../../utils/locale';
import { reportAnalytics } from '../../utils/report-analytics';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import { suggestionStyling } from './styles';
import { SEARCH_SUGGESTIONS } from './SearchInput';

const SearchMenu = forwardRef(function SearchMenu(
  {
    searchValue,
    searchBoxRef,
    isOpen,
    selectedOption,
    slug,
    selectedResult,
    setSelectedResult,
    isFocused,
    setChatbotAvail,
  },
  ref
) {
  const { handleSubmit, conversation } = useChatbotContext();
  const { project } = useSnootyMetadata();
  const docsets = useAllDocsets();
  const { snootyEnv } = useSiteMetadata();
  const locale = getCurrLocale();
  const [conversationInit, setConversationInit] = useState(false);

  // get search url for staging and prod environments
  // all other environments will fall back to prod
  // considers localization as well
  const fullSearchUrl = useMemo(() => {
    const ENVS_WITH_SEARCH = ['dotcomstg', 'dotcomprd'];
    const targetEnv = ENVS_WITH_SEARCH.includes(snootyEnv) ? snootyEnv : ENVS_WITH_SEARCH[1];
    const landingDocset = docsets.find((d) => d.project === 'landing');
    return (
      assertTrailingSlash(landingDocset.url[targetEnv]) +
      localizePath(assertTrailingSlash(landingDocset.prefix[targetEnv]) + 'search')
    );
  }, [docsets, snootyEnv]);

  const handleSearchResultClick = async (isChatbotRes) => {
    reportAnalytics('Search bar used', {
      type: isChatbotRes ? 'chatbot' : 'docs-search',
      query: searchValue,
    });
    if (isChatbotRes) {
      return handleSubmit(searchValue).catch((e) => console.error(e));
    }
    if (project === 'landing' && slug === 'search') {
      const newSearch = new URLSearchParams();
      newSearch.set('q', searchValue);
      return navigate(`?${newSearch.toString()}`, { state: { searchValue } });
    }
    return (window.location.href = `${fullSearchUrl}/?q=${searchValue}`);
  };

  useEffect(() => {
    if (!Number.isInteger(selectedResult)) {
      return;
    }
    handleSearchResultClick(selectedResult > 0);
    // NOTE: this effect should only run when selected result is changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedResult]);

  // NOTE: conversation is updated in effect below
  useEffect(() => {
    if (!conversation.conversationId) {
      return;
    }
    setChatbotAvail(!conversation.error && !!conversation.conversationId);
  }, [conversation, setChatbotAvail]);

  useEffect(() => {
    if (!isFocused || conversationInit || conversation.conversationId) {
      return;
    }
    setConversationInit(true);
    // NOTE: createConversation does not resolve / throw errors.
    // updates conversation from useChatbotContext instead
    // https://github.com/mongodb/chatbot/blob/mongodb-chatbot-ui-v0.8.1/packages/mongodb-chatbot-ui/src/useConversation.tsx#L409
    conversation.createConversation().finally((e) => setConversationInit(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const searchOptions = useMemo(() => {
    const useChatbot = !!conversation.conversationId && locale === 'en-us';
    return SEARCH_SUGGESTIONS.slice(0, useChatbot ? SEARCH_SUGGESTIONS.length : 1);
  }, [conversation, locale]);

  return (
    <>
      <SearchResultsMenu open={isOpen} refEl={searchBoxRef} ref={ref}>
        {searchOptions.map((suggestion, i) => {
          const { copy } = suggestion;
          const isChatbot = i === 1;
          return (
            <SearchResult
              className={cx(suggestionStyling({ copy }))}
              key={`result-${i}`}
              id={`result-${i}`}
              onClick={() => setSelectedResult(i)}
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
  slug: PropTypes.string,
};
