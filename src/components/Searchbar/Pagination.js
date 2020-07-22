import React, { useCallback, useMemo } from 'react';
import styled from '@emotion/styled';
import Button from '@leafygreen-ui/button';
import Icon from '@leafygreen-ui/icon';
import { uiColors } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';

const BUTTON_HEIGHT = theme.size.medium;
const BUTTON_WIDTH = '14px';
const ENABLED_COLOR = uiColors.gray.dark2;
const DISABLED_COLOR = uiColors.gray.light1;

const PaginationButton = styled(Button)`
  background-color: #fff;
  height: ${BUTTON_HEIGHT};
  padding: 0;
  width: ${BUTTON_WIDTH};
  z-index: 1;
  /* Below removes default hover effects from button */
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

const PaginationButtonIcon = styled(Icon)`
  height: ${BUTTON_HEIGHT};
  left: 0;
  position: absolute;
  top: 0;
  width: ${BUTTON_WIDTH};
`;

const PaginationContainer = styled('div')`
  align-items: center;
  display: flex;
`;

const PaginationText = styled('p')`
  font-size: ${theme.size.default};
  margin: 0 ${theme.size.tiny};
`;

const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
  const decrementPage = useCallback(() => setCurrentPage(currentPage - 1), [currentPage, setCurrentPage]);
  const incrementPage = useCallback(() => setCurrentPage(currentPage + 1), [currentPage, setCurrentPage]);
  const canDecrementPage = useMemo(() => currentPage !== 1, [currentPage]);
  const canIncrementPage = useMemo(() => currentPage < totalPages, [currentPage, totalPages]);
  return (
    <PaginationContainer>
      <PaginationButton
        aria-label="Back Page"
        disabled={!canDecrementPage}
        glyph={<PaginationButtonIcon glyph="ChevronLeft" fill={canDecrementPage ? ENABLED_COLOR : DISABLED_COLOR} />}
        onClick={decrementPage}
        title="Back Page"
      />
      <PaginationText>
        <strong>
          {currentPage}/{totalPages}
        </strong>
      </PaginationText>
      <PaginationButton
        aria-label="Forward Page"
        disabled={!canIncrementPage}
        glyph={<PaginationButtonIcon glyph="ChevronRight" fill={canIncrementPage ? ENABLED_COLOR : DISABLED_COLOR} />}
        onClick={incrementPage}
        title="Forward Page"
      />
    </PaginationContainer>
  );
};

export default Pagination;
