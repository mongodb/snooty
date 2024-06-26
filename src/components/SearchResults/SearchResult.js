import React, { useContext, useRef } from 'react';
import sanitizeHtml from 'sanitize-html';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { Body } from '@leafygreen-ui/typography';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { css, cx } from '@leafygreen-ui/emotion';
import { theme } from '../../theme/docsTheme';
import Tag, { searchTagStyle, tagHeightStyle } from '../Tag';
import SearchContext from './SearchContext';
import { getFacetTagVariant } from './Facets/utils';
import { getBoxShadowColor } from './SearchResults';

// Use string for match styles due to replace/innerHTML
const SEARCH_MATCH_STYLE = `border-radius: 3px; padding-left: 2px; padding-right: 2px;`;

const largeResultTitle = `
  font-size: ${theme.size.default};
  line-height: ${theme.size.medium};
  font-weight: 600;
`;

// Truncates text to a maximum number of lines
const truncate = (maxLines) => `
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

const StyledResultTitle = styled('p')``;

const resultTitleStyling = () => css`
  font-family: 'Euclid Circular A';
  color: var(--title-color);
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

const SearchResultLink = styled('a')``;

const searchResultLinkStyling = () => css`
  color: var(--title-color);
  height: 100%;
  text-decoration: none;
  border-radius: ${theme.size.medium};
  :visited {
    p:first-child {
      color: var(--title-color-on-visited);
    }
  }
  :hover,
  :focus {
    p:first-child {
      color: var(--title-color);
      text-decoration: none;
    }
    > div {
      background-color: rgba(231, 238, 236, 0.4);
      transition: background-color 150ms ease-in;
    }
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
  ${searchTagStyle}
`;

const StylingTagContainer = styled('div')`
  bottom: 0;
  margin-bottom: ${theme.size.medium};
  overflow: hidden;
  ${tagHeightStyle};
`;

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const highlightSearchTerm = (text, searchTerm, darkMode) =>
  text.replace(
    new RegExp(escapeRegExp(searchTerm), 'gi'),
    (result) =>
      `<span style="background-color: ${
        darkMode ? palette.green.dark2 : palette.green.light2
      };${SEARCH_MATCH_STYLE}">${result}</span>`
  );

const spanAllowedStyles = {
  'background-color': [new RegExp(`^${palette.green.light2}$`, 'i'), new RegExp(`^${palette.green.dark2}$`, 'i')],
  'border-radius': [new RegExp(`^3px$`)],
  'padding-left': [new RegExp(`^2px$`)],
  'padding-right': [new RegExp(`^2px$`)],
};

// since we are using dangerouslySetInnerHTML, this helper sanitizes input to be safe
const sanitizePreviewHtml = (text) =>
  sanitizeHtml(text, {
    allowedTags: ['span'],
    allowedAttributes: { span: ['style'] },
    allowedStyles: {
      span: spanAllowedStyles,
    },
  });

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
    facets,
    ...props
  }) => {
    const { darkMode } = useDarkMode();
    const { searchPropertyMapping, searchTerm, getFacetName, showFacets } = useContext(SearchContext);
    const highlightedPreviewText = highlightSearchTerm(preview, searchTerm, darkMode);
    const resultLinkRef = useRef(null);
    const category = searchPropertyMapping?.[searchProperty]?.['categoryTitle'];
    const version = searchPropertyMapping?.[searchProperty]?.['versionSelectorLabel'];
    const validFacets = facets?.filter(getFacetName);

    return (
      <SearchResultLink
        ref={resultLinkRef}
        href={url}
        onClick={onClick}
        className={cx(searchResultLinkStyling())}
        style={getBoxShadowColor(darkMode)}
        {...props}
      >
        <SearchResultContainer>
          <StyledResultTitle
            style={{
              '--title-color': darkMode ? palette.blue.light1 : palette.blue.base,
              '--title-color-on-visited': darkMode ? palette.purple.light2 : palette.purple.dark2,
            }}
            className={cx(resultTitleStyling())}
            dangerouslySetInnerHTML={{
              __html: sanitizePreviewHtml(title),
            }}
            useLargeTitle={useLargeTitle}
          />
          <StyledPreviewText
            maxLines={maxLines}
            dangerouslySetInnerHTML={{
              __html: sanitizePreviewHtml(highlightedPreviewText),
            }}
          />
          {!showFacets && (
            <StylingTagContainer>
              {!!category && <StyledTag variant="green">{category}</StyledTag>}
              {!!version && <StyledTag variant="blue">{version}</StyledTag>}
              {url.includes('/api/') && <StyledTag variant="purple">{'API'}</StyledTag>}
            </StylingTagContainer>
          )}
          {showFacets && validFacets?.length > 0 && (
            <StylingTagContainer>
              {validFacets.map((facet, idx) => (
                <StyledTag variant={getFacetTagVariant(facet)} key={`${idx}-${facet.key}-${facet.id}`}>
                  {getFacetName(facet)}
                </StyledTag>
              ))}
            </StylingTagContainer>
          )}
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
