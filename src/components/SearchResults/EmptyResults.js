import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';

export const EMPTY_STATE_HEIGHT = '166px';
const MAGNIFYING_GLASS_SIZE = '40px';
const MAX_WIDTH = '337px';

const MagnifyingGlassButton = styled(IconButton)`
  /* Give 8px space on each side for hover state */
  height: calc(${MAGNIFYING_GLASS_SIZE} + ${theme.size.default});
  width: calc(${MAGNIFYING_GLASS_SIZE} + ${theme.size.default});
  span {
    height: ${MAGNIFYING_GLASS_SIZE};
    width: ${MAGNIFYING_GLASS_SIZE};
  }
`;

const MagnifyingGlass = styled(Icon)`
  color: ${palette.black};
  height: ${MAGNIFYING_GLASS_SIZE};
  width: ${MAGNIFYING_GLASS_SIZE};
`;

const SupportingText = styled('p')`
  font-size: ${theme.fontSize.default};
  line-height: ${theme.size.medium};
`;

const TitleText = styled('h3')`
  color: ${palette.black};
  font-size: ${theme.fontSize.h3};
  line-height: 21px;
  margin-bottom: ${theme.size.default};
`;

const EmptyStateContainer = styled('div')`
  align-items: center;
  display: flex;
  flex-direction: column;
  font-family: Akzidenz;
  letter-spacing: 0.5px;
  margin: 0 auto;
  max-width: ${MAX_WIDTH};
  text-align: center;
`;

const EMPTY_RESULT_TYPES = {
  noResultsFound: {
    title: 'No results found. Please search again.',
    description:
      "Sorry. We weren't able to find any results for your query. The page might have been moved or deleted.",
  },
  searchLandingPage: {
    title: 'Search MongoDB Documentation',
    description: 'Find guides, examples, and best practices for working with the MongoDB data platform.',
  },
};

const EmptyResults = ({ type }) => {
  const focusOnSearchbar = useCallback(() => {
    document.querySelector('button[aria-label="Open Search"]').click();
    const searchbar = document.querySelector(`form[role="search"] input[type="text"]`);
    if (searchbar) {
      searchbar.focus();
    }
  }, []);

  const title = EMPTY_RESULT_TYPES?.[type]?.title || EMPTY_RESULT_TYPES.noResultsFound.title;
  const description = EMPTY_RESULT_TYPES?.[type]?.description || EMPTY_RESULT_TYPES.noResultsFound.description;

  return (
    <EmptyStateContainer>
      <MagnifyingGlassButton aria-label="Search MongoDB Documentation" onClick={focusOnSearchbar}>
        <MagnifyingGlass glyph="MagnifyingGlass" />
      </MagnifyingGlassButton>
      <TitleText>
        <strong>{title}</strong>
      </TitleText>
      <SupportingText>{description}</SupportingText>
    </EmptyStateContainer>
  );
};

EmptyResults.propTypes = {
  type: PropTypes.string,
};

export default EmptyResults;
