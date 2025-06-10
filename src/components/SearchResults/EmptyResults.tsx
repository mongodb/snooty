import React from 'react';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { H3 } from '@leafygreen-ui/typography';
import NoResults from '../SVGs/NoResults';

export const EMPTY_STATE_HEIGHT = '166px';
const MAX_WIDTH = '637px';

const EmptyStateContainer = styled('div')`
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto;
  grid-column-gap: 5px;
  font-family: 'Euclid Circular A';
  letter-spacing: 0.5px;
  margin: 0 auto;
  max-width: ${MAX_WIDTH};
`;

const NoResultText = styled('div')`
  padding-left: 56px;
  padding-top: 20px;
`;

const SupportingText = styled('p')`
  color: ${palette.gray.dark1};
  font-size: 13px;
  font-family: Euclid Circular A;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;

  .dark-theme & {
    color: ${palette.gray.light2};
  }
`;

const EmptyResults = () => {
  return (
    <EmptyStateContainer>
      <NoResults />
      <NoResultText>
        <H3>No results found</H3>
        <SupportingText>
          We weren’t able to find any results for your query. Try adjusting your keywords to find what you’re looking
          for.
        </SupportingText>
      </NoResultText>
    </EmptyStateContainer>
  );
};

export default EmptyResults;
