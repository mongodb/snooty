import React, { useCallback, useContext, useRef } from 'react';
import sanitizeHtml from 'sanitize-html';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';
import { getNestedValue } from '../../utils/get-nested-value';
import SearchContext from './SearchContext';
import { StyledTextInput } from './SearchTextInput';
import { SearchResultsContainer } from './SearchDropdown';

const ARROW_DOWN_KEY = 40;
const ARROW_UP_KEY = 38;
const LINK_COLOR = '#494747';
// Use string for match styles due to replace/innerHTML
const SEARCH_MATCH_STYLE = `background-color: ${uiColors.yellow.light2};`;

const largeResultTitle = css`
  font-size: ${theme.size.default};
  line-height: ${theme.size.medium};
  /* Only add bold on larger devices */
  @media ${theme.screenSize.smallAndUp} {
    font-weight: bolder;
  }
`;

// Truncates text to a maximum number of lines
const truncate = maxLines => css`
  display: -webkit-box;
  -webkit-line-clamp: ${maxLines}; /* supported cross browser */
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MobileFooterContainer = styled('div')`
  align-items: flex-end;
  display: flex;
  flex: 1;
  justify-content: flex-end;
`;

const LearnMoreLink = styled('a')`
  font-size: ${theme.fontSize.small};
  letter-spacing: 0.5px;
  line-height: ${theme.size.default};
`;

const SearchResultContainer = styled('div')`
  height: 100%;
  @media ${theme.screenSize.upToSmall} {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`;

const SearchResultLink = styled('a')`
  color: ${LINK_COLOR};
  height: 100%;
  text-decoration: none;
  :hover,
  :focus {
    color: ${LINK_COLOR};
    text-decoration: none;
    ${SearchResultContainer} {
      background-color: rgba(231, 238, 236, 0.4);
      transition: background-color 150ms ease-in;
    }
  }
`;

const StyledPreviewText = styled('p')`
  font-family: 'Akzidenz Grotesk BQ Light';
  font-size: ${theme.fontSize.small};
  letter-spacing: 0.5px;
  line-height: 20px;
  margin-bottom: 0;
  margin-top: 0;
  ${({ maxLines }) => truncate(maxLines)};
`;

const StyledResultTitle = styled('p')`
  font-family: Akzidenz;
  font-size: ${theme.fontSize.small};
  line-height: ${theme.size.medium};
  letter-spacing: 0.5px;
  height: ${theme.size.medium};
  margin-bottom: 6px;
  margin-top: 0;
  ${truncate(1)};
  ${({ useLargeTitle }) => useLargeTitle && largeResultTitle};
  @media ${theme.screenSize.upToSmall} {
    ${largeResultTitle};
  }
`;

const highlightSearchTerm = (text, searchTerm) =>
  text.replace(new RegExp(searchTerm, 'gi'), result => `<span style="${SEARCH_MATCH_STYLE}">${result}</span>`);

// since we are using dangerouslySetInnerHTML, this helper sanitizes input to be safe
const sanitizePreviewHtml = text =>
  sanitizeHtml(text, {
    allowedTags: ['span'],
    allowedAttributes: { span: ['style'] },
    allowedStyles: { span: { 'background-color': [new RegExp(`^${uiColors.yellow.light2}$`, 'i')] } },
  });

const onArrowDown = resultLinkRef => {
  const nextSibling = getNestedValue(['current', 'nextSibling'], resultLinkRef);
  if (nextSibling) {
    nextSibling.focus();
  } else {
    // This is the last result, so let's loop back to the top
    document.querySelector(`${SearchResultsContainer} ${SearchResultLink}`).focus();
  }
};

const onArrowUp = resultLinkRef => {
  const prevSibling = getNestedValue(['current', 'previousSibling'], resultLinkRef);
  if (prevSibling) {
    // If these don't match, we have gone up out of the results
    if (prevSibling.nodeName !== resultLinkRef.current.nodeName) {
      // This is the first result, so let's go to the search bar
      document.querySelector(`${StyledTextInput} input`).focus();
    } else {
      prevSibling.focus();
    }
  }
};

const SearchResult = React.memo(
  ({
    allowKeyNavigation = true,
    learnMoreLink = false,
    maxLines = 2,
    useLargeTitle = false,
    onClick,
    preview,
    title,
    url,
    ...props
  }) => {
    const { searchTerm } = useContext(SearchContext);
    const highlightedTitle = highlightSearchTerm(title, searchTerm);
    const highlightedPreviewText = highlightSearchTerm(preview, searchTerm);
    const resultLinkRef = useRef(null);
    // Navigate with arrow keys
    const onKeyDown = useCallback(
      e => {
        if (allowKeyNavigation) {
          if (e.key === 'ArrowDown' || e.keyCode === ARROW_DOWN_KEY) {
            e.preventDefault();
            // find next result and focus
            onArrowDown(resultLinkRef);
          } else if (e.key === 'ArrowUp' || e.keyCode === ARROW_UP_KEY) {
            e.preventDefault();
            // find previous result and focus
            onArrowUp(resultLinkRef);
          }
        }
      },
      [allowKeyNavigation]
    );
    return (
      <SearchResultLink ref={resultLinkRef} href={url} onClick={onClick} onKeyDown={onKeyDown} {...props}>
        <SearchResultContainer>
          <StyledResultTitle
            dangerouslySetInnerHTML={{
              __html: sanitizePreviewHtml(highlightedTitle),
            }}
            useLargeTitle={useLargeTitle}
          />
          <StyledPreviewText
            maxLines={maxLines}
            dangerouslySetInnerHTML={{
              __html: sanitizePreviewHtml(highlightedPreviewText),
            }}
          />
          {learnMoreLink && (
            <MobileFooterContainer>
              <LearnMoreLink href={url}>
                <strong>Learn More</strong>
              </LearnMoreLink>
            </MobileFooterContainer>
          )}
        </SearchResultContainer>
      </SearchResultLink>
    );
  }
);

export { SearchResultLink };
export default SearchResult;
