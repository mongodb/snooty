import React from 'react';
import { keyframes } from '@emotion/core';
import styled from '@emotion/styled';
import Button from '@leafygreen-ui/button';
import Icon from '@leafygreen-ui/icon';
import { uiColors } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';
import SearchFilters from './SearchFilters';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const StyledContentContainer = styled('div')`
  animation: ${fadeIn} 300ms ease;
`;

const StyledAdvancedFiltersPane = styled('div')`
  box-shadow: 0 0 ${theme.size.tiny} 0 rgba(184, 196, 194, 0.48);
  position: relative;
  padding: ${theme.size.large} ${theme.size.default} 0;
`;

const StyledReturnButton = styled(Button)`
  color: ${uiColors.blue.base};
  font-family: Akzidenz;
  font-size: ${theme.fontSize.tiny};
  letter-spacing: 0.5px;
  line-height: ${theme.size.default};
  margin: 0;
  padding: 0;
  /* Below removes default hover effects from button */
  background: none;
  background-image: none;
  border: none;
  box-shadow: none;
  :before {
    display: none;
  }
  :after {
    display: none;
  }
`;

const StyledSearchFilters = styled(SearchFilters)`
  margin-top: ${theme.size.default};
`;

const AdvancedFiltersPane = ({ closeFiltersPane, searchFilter, setSearchFilter, ...props }) => (
  <StyledAdvancedFiltersPane {...props}>
    <StyledContentContainer>
      <StyledReturnButton onClick={closeFiltersPane}>
        <Icon glyph="ArrowLeft" size="small" />
        &nbsp;Back to results
      </StyledReturnButton>
      <StyledSearchFilters searchFilter={searchFilter} setSearchFilter={setSearchFilter} hasSideLabels />
    </StyledContentContainer>
  </StyledAdvancedFiltersPane>
);

export default AdvancedFiltersPane;
