import React, { useContext, useCallback } from 'react';
import { Global, css } from '@emotion/react';
import styled from '@emotion/styled';
import Icon from '@leafygreen-ui/icon';
import { uiColors } from '@leafygreen-ui/palette';
import useStickyTopValues from '../../hooks/useStickyTopValues';
import SearchContext from '../Searchbar/SearchContext';
import SearchFilters from '../Searchbar/SearchFilters';
import { theme } from '../../theme/docsTheme';

// Temporarily apply this css rule to prevent body scrolling only while
// this component is mounted.
const disableBodyScroll = css`
  body {
    overflow: hidden;
  }
`;

const Container = styled('div')`
  background-color: ${uiColors.white};
  position: fixed;
  left: 0;
  top: ${({ topValue }) => topValue};
  height: calc(100vh - ${({ topValue }) => topValue});
  overflow-y: scroll;
  right: 0;
  bottom: 0;
  width: 100%;
  padding: ${theme.size.large} ${theme.size.medium};
  z-index: 1;
`;

const BackButton = styled('div')`
  align-items: center;
  color: ${uiColors.gray.dark1};
  cursor: pointer;
  display: flex;
  gap: 0 ${theme.size.small};
`;

const Label = styled('div')`
  font-size: 18px;
  font-weight: 500;
  margin: ${theme.size.small} 0 ${theme.size.medium} 0;
`;

const MobileFilters = () => {
  const { topSmall } = useStickyTopValues();
  const { setShowMobileFilters } = useContext(SearchContext);

  const closeMobileFilters = useCallback(() => {
    setShowMobileFilters(false);
  }, [setShowMobileFilters]);

  return (
    <>
      <Global styles={disableBodyScroll} />
      <Container topValue={topSmall}>
        <BackButton onClick={closeMobileFilters}>
          <Icon glyph="ArrowLeft" />
          Back to search results
        </BackButton>
        <Label>Specify your search</Label>
        <SearchFilters manuallyApplyFilters={true} onApplyFilters={closeMobileFilters} />
      </Container>
    </>
  );
};

export default MobileFilters;
