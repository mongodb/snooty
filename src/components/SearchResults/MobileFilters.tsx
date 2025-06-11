import React, { useContext, useCallback } from 'react';
import styled from '@emotion/styled';
import Icon from '@leafygreen-ui/icon';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';
import { FacetOption } from '../../types/data';
import SearchContext from './SearchContext';
import SearchFilters from './SearchFilters';
import { Facets } from './Facets';

const Container = styled('div')`
  background-color: var(--background-color-primary);
  padding-top: ${theme.size.large};
  width: 100%;
`;

const BackButton = styled('div')`
  align-items: center;
  color: ${palette.gray.dark1};
  cursor: pointer;
  display: flex;
  gap: 0 ${theme.size.small};
  font-size: ${theme.fontSize.default};
  line-height: ${theme.size.medium};

  .dark-theme & {
    color: ${palette.gray.light1};
  }
`;

const Label = styled('div')`
  font-size: 18px;
  font-weight: 500;
  margin: ${theme.size.small} 0 ${theme.size.medium} 0;
`;

const MobileFilters = ({ facets }: { facets: Array<FacetOption> }) => {
  const { setShowMobileFilters, showFacets } = useContext(SearchContext);

  const closeMobileFilters = useCallback(() => {
    setShowMobileFilters(false);
  }, [setShowMobileFilters]);

  return (
    <Container>
      <BackButton onClick={closeMobileFilters}>
        <Icon glyph="ArrowLeft" />
        Back to search results
      </BackButton>
      <Label>Refine your search</Label>
      {showFacets ? (
        <Facets facets={facets} />
      ) : (
        <SearchFilters manuallyApplyFilters={true} onApplyFilters={closeMobileFilters} />
      )}
    </Container>
  );
};

export default MobileFilters;
