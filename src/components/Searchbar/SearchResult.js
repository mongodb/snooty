import React, { useContext } from 'react';
import sanitizeHtml from 'sanitize-html';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';
import SearchContext from './SearchContext';

const LINK_COLOR = '#494747';
// Use string for match styles due to replace/innerHTML
const SEARCH_MATCH_STYLE = `background-color: ${uiColors.yellow.light2};`;

// Truncates text to a maximum number of lines
const truncate = maxLines => css`
  display: -webkit-box;
  -webkit-line-clamp: ${maxLines}; /* supported cross browser */
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const SearchResultContainer = styled('div')`
  height: 100%;
`;

const SearchResultLink = styled('a')`
  color: ${LINK_COLOR};
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
  font-size: 14px;
  letter-spacing: 0.5px;
  line-height: 20px;
  margin-bottom: 0;
  margin-top: 0;
  ${({ maxLines }) => truncate(maxLines)};
`;

const StyledResultTitle = styled('p')`
  font-family: Akzidenz;
  font-size: 14px;
  line-height: ${theme.size.medium};
  letter-spacing: 0.5px;
  height: ${theme.size.medium};
  margin-bottom: 6px;
  margin-top: 0;
  ${truncate(1)};
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

const SearchResult = React.memo(({ maxLines = 2, preview, title, url, ...props }) => {
  const searchTerm = useContext(SearchContext);
  const highlightedTitle = highlightSearchTerm(title, searchTerm);
  const highlightedPreviewText = highlightSearchTerm(preview, searchTerm);
  return (
    <SearchResultLink href={url} {...props}>
      <SearchResultContainer>
        <StyledResultTitle
          dangerouslySetInnerHTML={{
            __html: sanitizePreviewHtml(highlightedTitle),
          }}
        />
        <StyledPreviewText
          maxLines={maxLines}
          dangerouslySetInnerHTML={{
            __html: sanitizePreviewHtml(highlightedPreviewText),
          }}
        />
      </SearchResultContainer>
    </SearchResultLink>
  );
});

export default SearchResult;
