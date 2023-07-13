import React, { useContext, useRef } from 'react';
import sanitizeHtml from 'sanitize-html';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { Body } from '@leafygreen-ui/typography';
import { theme } from '../../theme/docsTheme';
import Tag, { searchTagStyle, searchTagStyleFeature } from '../Tag';
import SearchContext from './SearchContext';

const LINK_COLOR = '#494747';
// Use string for match styles due to replace/innerHTML
const newSearchInput = process.env.GATSBY_TEST_SEARCH_UI === 'true';
const SEARCH_MATCH_STYLE = newSearchInput
  ? `background-color: ${palette.green.light2} ; border-radius: 3px; padding-left: 2px; padding-right: 2px;`
  : `background-color: ${palette.yellow.light2};`;

const largeResultTitle = css`
  font-size: ${theme.size.default};
  line-height: ${theme.size.medium};
  font-weight: 600;
`;

// Truncates text to a maximum number of lines
const truncate = (maxLines) => css`
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
`;

const StyledResultTitle = styled('p')`
  font-family: 'Euclid Circular A';
  ${newSearchInput ? `color: #016bf8;` : ``}
  font-size: ${theme.fontSize.small};
  line-height: ${theme.size.medium};
  letter-spacing: 0.5px;
  height: ${theme.size.medium};
  margin-bottom: ${theme.size.small};
  margin-top: 0;
  ${truncate(1)};
  ${({ useLargeTitle }) => useLargeTitle && largeResultTitle};
  @media ${theme.screenSize.upToSmall} {
    ${largeResultTitle};
  }
  position: relative;
`;

const SearchResultLink = styled('a')`
  color: ${LINK_COLOR};
  height: 100%;
  text-decoration: none;
  border-radius: ${theme.size.medium};
  :hover,
  :focus {
    color: ${LINK_COLOR};
    text-decoration: none;
    ${SearchResultContainer} {
      background-color: rgba(231, 238, 236, 0.4);
      transition: background-color 150ms ease-in;
    }
  }
  :visited {
    ${newSearchInput ? `${StyledResultTitle} {color: #5e0c9e;}` : ``}
  }
`;

const StyledPreviewText = styled(Body)`
  font-size: ${theme.fontSize.small};
  line-height: 20px;
  margin-bottom: ${theme.size.default};
  ${({ maxLines }) => truncate(maxLines)};
  // Reserve some space inside of the search result card when there is no preview
  min-height: 20px;
`;

const StyledTag = styled(Tag)`
  ${newSearchInput ? searchTagStyleFeature : searchTagStyle}
`;

const StylingTagContainer = styled('div')`
  bottom: 0;
  margin-bottom: ${theme.size.medium};
`;

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const highlightSearchTerm = (text, searchTerm) =>
  text.replace(
    new RegExp(escapeRegExp(searchTerm), 'gi'),
    (result) => `<span style="${SEARCH_MATCH_STYLE}">${result}</span>`
  );

// since we are using dangerouslySetInnerHTML, this helper sanitizes input to be safe
const sanitizePreviewHtml = (text) =>
  sanitizeHtml(
    text,
    newSearchInput
      ? {
          allowedTags: ['span'],
          allowedAttributes: { span: ['style'] },
          allowedStyles: {
            span: {
              'background-color': [new RegExp(`^${palette.green.light2}$`, 'i')],
              'border-radius': [new RegExp(`^3px$`)],
              'padding-left': [new RegExp(`^2px$`)],
              'padding-right': [new RegExp(`^2px$`)],
            },
          },
        }
      : {
          allowedTags: ['span'],
          allowedAttributes: { span: ['style'] },
          allowedStyles: { span: { 'background-color': [new RegExp(`^${palette.yellow.light2}$`, 'i')] } },
        }
  );

const SearchResult = React.memo(
  ({
    learnMoreLink = false,
    maxLines = 2,
    useLargeTitle = false,
    onClick,
    preview,
    title,
    searchProperty,
    url,
    ...props
  }) => {
    const { searchPropertyMapping, searchTerm } = useContext(SearchContext);
    const highlightedTitle = highlightSearchTerm(title, searchTerm);
    const highlightedPreviewText = highlightSearchTerm(preview, searchTerm);
    const resultLinkRef = useRef(null);
    const category = searchPropertyMapping?.[searchProperty]?.['categoryTitle'];
    const version = searchPropertyMapping?.[searchProperty]?.['versionSelectorLabel'];
    const newSearchInput = process.env.GATSBY_TEST_SEARCH_UI === 'true';

    return (
      <SearchResultLink ref={resultLinkRef} href={url} onClick={onClick} {...props}>
        <SearchResultContainer>
          <StyledResultTitle
            dangerouslySetInnerHTML={{
              __html: sanitizePreviewHtml(newSearchInput ? title : highlightedTitle),
            }}
            useLargeTitle={useLargeTitle}
          />
          <StyledPreviewText
            maxLines={maxLines}
            dangerouslySetInnerHTML={{
              __html: sanitizePreviewHtml(highlightedPreviewText),
            }}
          />
          <StylingTagContainer>
            {!!category && <StyledTag variant="green">{category}</StyledTag>}
            {!!version && <StyledTag variant="blue">{version}</StyledTag>}
            {url.includes('/api/') && <StyledTag variant="purple">{'API'}</StyledTag>}
          </StylingTagContainer>
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
