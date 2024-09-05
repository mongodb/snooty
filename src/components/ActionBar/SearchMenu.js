import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { navigate } from 'gatsby';
import { SearchResultsMenu, SearchResult } from '@leafygreen-ui/search-input';
import { css, cx } from '@leafygreen-ui/emotion';
import { ModalView, MongoDbLegalDisclosure, PoweredByAtlasVectorSearch, useChatbotContext } from 'mongodb-chatbot-ui';
import PropTypes from 'prop-types';
import { useAllDocsets } from '../../hooks/useAllDocsets';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import { assertTrailingSlash } from '../../utils/assert-trailing-slash';
import { localizePath } from '../../utils/locale';
import { reportAnalytics } from '../../utils/report-analytics';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import { suggestionStyling } from './styles';
import { SEARCH_SUGGESTIONS } from './SearchInput';

// Using a forward ref and imperative handle
// to expose lazy loaded child (chatbot) behaviors to parent (SearchInput)
// https://react.dev/reference/react/useImperativeHandle
const SearchMenu = forwardRef(function SearchMenu({ searchValue, searchBoxRef, isOpen, selectedOption, slug }, ref) {
  const { handleSubmit, conversation } = useChatbotContext();
  const menuRef = useRef();
  const { project } = useSnootyMetadata();
  const docsets = useAllDocsets();
  const { snootyEnv } = useSiteMetadata();

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

  const handleSearchResultClick = useCallback(
    async (isChatbotRes) => {
      reportAnalytics('Search bar used', {
        type: isChatbotRes ? 'chatbot' : 'docs-search',
        query: searchValue,
      });
      if (isChatbotRes) {
        return handleSubmit(searchValue);
      }
      if (project === 'landing' && slug === 'search') {
        const newSearch = new URLSearchParams();
        newSearch.set('q', searchValue);
        return navigate(`?${newSearch.toString()}`, { state: { searchValue } });
      }
      return (window.location.href = `${fullSearchUrl}/?q=${searchValue}`);
    },
    [handleSubmit, project, fullSearchUrl, searchValue, slug]
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
    if (!isOpen || !!conversation.conversationId) {
      return;
    }
    const initConvo = async () => {
      await conversation.createConversation();
    };
    initConvo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <>
      <SearchResultsMenu open={isOpen} refEl={searchBoxRef} ref={menuRef}>
        {SEARCH_SUGGESTIONS.slice(0, !conversation.conversationId ? 1 : SEARCH_SUGGESTIONS.length).map(
          (suggestion, i) => {
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
          }
        )}
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
