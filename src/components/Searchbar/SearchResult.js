import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { theme } from '../../theme/docsTheme';

const LINK_COLOR = '#494747';
const RESULT_HOVER_COLOR = '#d8d8d8';

// Truncates text to a maximum number of lines
const truncate = maxLines => css`
  display: -webkit-box;
  -webkit-line-clamp: ${maxLines}; /* supported cross browser */
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const SearchResultContainer = styled('div')`
  height: 100%;
  :hover,
  :focus {
    background-color: ${RESULT_HOVER_COLOR};
    transition: background-color 150ms ease-in;
  }
`;

const SearchResultLink = styled('a')`
  color: ${LINK_COLOR};
  text-decoration: none;
  :hover,
  :focus {
    color: ${LINK_COLOR};
    text-decoration: none;
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

const SearchResult = React.memo(({ maxLines = 2, preview, title, url, ...props }) => (
  <SearchResultLink href={url} {...props}>
    <SearchResultContainer>
      <StyledResultTitle>{title}</StyledResultTitle>
      <StyledPreviewText maxLines={maxLines}>{preview}</StyledPreviewText>
    </SearchResultContainer>
  </SearchResultLink>
));

export default SearchResult;
