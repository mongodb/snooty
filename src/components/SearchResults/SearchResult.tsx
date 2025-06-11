import React, { useContext, useRef } from 'react';
import sanitizeHtml from 'sanitize-html';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { Body } from '@leafygreen-ui/typography';
import { css, cx } from '@leafygreen-ui/emotion';
import { theme } from '../../theme/docsTheme';
import Tag, { searchTagStyle, tagHeightStyle } from '../Tag';
import SearchContext from './SearchContext';
import { getFacetTagVariant } from './Facets/utils';
import { DocsSearchResponseResult, searchResultDynamicStyling } from './SearchResults';

// Use string for match styles due to replace/innerHTML
const SEARCH_MATCH_STYLE = `border-radius: 3px; padding-left: 2px; padding-right: 2px;`;

const largeResultTitle = `
  font-size: ${theme.size.default};
  line-height: 28px;
  font-weight: 600;
`;

// Truncates text to a maximum number of lines
const truncate = (maxLines: number) => `
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

const StyledResultTitle = styled('p')<{ useLargeTitle: boolean }>`
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

const searchResultLinkStyling = css`
  height: 100%;
  text-decoration: none;
  border-radius: ${theme.size.medium};

  .search-result-title {
    color: ${palette.blue.base};

    .dark-theme & {
      color: ${palette.blue.light1};
    }
  }
  :visited {
    .search-result-title {
      color: ${palette.purple.dark2};

      .dark-theme & {
        color: ${palette.purple.light2};
      }
    }
  }
  :hover,
  :focus {
    .search-result-title {
      color: ${palette.blue.base};

      .dark-theme & {
        color: ${palette.blue.light1};
      }
      text-decoration: none;
    }
    .search-result-container {
      background-color: rgba(231, 238, 236, 0.4);
      transition: background-color 150ms ease-in;
    }
  }
`;

const StyledPreviewText = styled(Body)<{ maxLines: number }>`
  font-size: ${theme.fontSize.small};
  color: var(--font-color-primary);
  line-height: 20px;
  margin-bottom: ${theme.size.default};
  ${({ maxLines }) => truncate(maxLines)};
  // Reserve some space inside of the search result card when there is no preview
  min-height: 20px;

  // Targets highlighted search term
  > span {
    background-color: ${palette.green.light2};

    .dark-theme & {
      background-color: ${palette.green.dark2};
    }
  }
`;

const StyledTag = styled(Tag)`
  ${searchTagStyle}
`;

const greenTagStyles = css`
  background-color: ${palette.green.light3};
  border: 1px solid ${palette.green.light2};
  color: ${palette.green.dark2};

  .dark-theme & {
    background-color: ${palette.green.dark3};
    border: 1px solid ${palette.green.dark2};
    color: ${palette.green.light1};
  }
`;

const blueTagStyles = css`
  background-color: ${palette.blue.light3};
  border: 1px solid ${palette.blue.light2};
  color: ${palette.blue.dark1};

  .dark-theme & {
    background-color: ${palette.blue.dark3};
    border: 1px solid ${palette.blue.dark2};
    color: ${palette.blue.light1};
  }
`;

const purpleTagStyles = css`
  background-color: ${palette.purple.light3};
  border: 1px solid ${palette.purple.light2};
  color: ${palette.purple.dark2};

  .dark-theme & {
    background-color: ${palette.purple.dark3};
    border: 1px solid ${palette.purple.dark2};
    color: ${palette.purple.light2};
  }
`;

const StylingTagContainer = styled('div')`
  bottom: 0;
  margin-bottom: ${theme.size.medium};
  overflow: hidden;
  ${tagHeightStyle};
`;

const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const highlightSearchTerm = (text: string, searchTerm: string | null) =>
  searchTerm
    ? text.replace(
        new RegExp(escapeRegExp(searchTerm), 'gi'),
        (result) => `<span style="${SEARCH_MATCH_STYLE}">${result}</span>`
      )
    : text;

const spanAllowedStyles = {
  'background-color': [new RegExp(`^${palette.green.light2}$`, 'i'), new RegExp(`^${palette.green.dark2}$`, 'i')],
  'border-radius': [new RegExp(`^3px$`)],
  'padding-left': [new RegExp(`^2px$`)],
  'padding-right': [new RegExp(`^2px$`)],
};

// since we are using dangerouslySetInnerHTML, this helper sanitizes input to be safe
const sanitizePreviewHtml = (text: string) =>
  sanitizeHtml(text, {
    allowedTags: ['span'],
    allowedAttributes: { span: ['style'] },
    allowedStyles: {
      span: spanAllowedStyles,
    },
  });

export type SearchResultProps = {
  learnMoreLink?: boolean;
  maxLines?: number;
  useLargeTitle?: boolean;
  onClick?: () => void;
  preview: string;
  title: string;
  searchProperty?: string;
  url: string;
  facets: DocsSearchResponseResult['facets'];
  className?: string;
};

const SearchResult = React.memo(
  ({
    learnMoreLink = false,
    maxLines = 2,
    useLargeTitle = false,
    onClick,
    preview,
    title,
    searchProperty = '',
    url,
    facets,
    className,
    ...props
  }: SearchResultProps) => {
    const { searchPropertyMapping, searchTerm, getFacetName, showFacets } = useContext(SearchContext);
    const highlightedPreviewText = highlightSearchTerm(preview, searchTerm);
    const resultLinkRef = useRef(null);
    const category = searchPropertyMapping?.[searchProperty]?.['categoryTitle'];
    const version = searchPropertyMapping?.[searchProperty]?.['versionSelectorLabel'];
    const validFacets = facets?.filter(getFacetName);

    return (
      <a
        ref={resultLinkRef}
        href={url}
        onClick={onClick}
        {...props}
        className={cx(className, searchResultLinkStyling, searchResultDynamicStyling)}
      >
        <SearchResultContainer className="search-result-container">
          <StyledResultTitle
            dangerouslySetInnerHTML={{
              __html: sanitizePreviewHtml(title),
            }}
            useLargeTitle={useLargeTitle}
            className="search-result-title"
          />
          <StyledPreviewText
            maxLines={maxLines}
            dangerouslySetInnerHTML={{
              __html: sanitizePreviewHtml(highlightedPreviewText),
            }}
          />
          {!showFacets && (
            <StylingTagContainer>
              {!!category && (
                <StyledTag variant="green" className={cx(greenTagStyles)}>
                  {category}
                </StyledTag>
              )}
              {!!version && (
                <StyledTag variant="blue" className={cx(blueTagStyles)}>
                  {version}
                </StyledTag>
              )}
              {url.includes('/api/') && (
                <StyledTag variant="purple" className={cx(purpleTagStyles)}>
                  {'API'}
                </StyledTag>
              )}
            </StylingTagContainer>
          )}
          {showFacets && validFacets && validFacets?.length > 0 && (
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
      </a>
    );
  }
);

export default SearchResult;
