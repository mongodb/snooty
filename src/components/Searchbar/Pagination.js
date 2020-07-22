import React, { useCallback, useMemo } from 'react';
import styled from '@emotion/styled';
import IconButton from '@leafygreen-ui/icon-button';
import Icon from '@leafygreen-ui/icon';
import { uiColors } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';

const BUTTON_WIDTH = '14px';
const ENABLED_COLOR = uiColors.gray.dark2;
const DISABLED_COLOR = uiColors.gray.light1;

const PaginationButton = styled(IconButton)`
  background-color: #fff;
  padding: 0;
  width: ${BUTTON_WIDTH};
  z-index: 1;
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
  const decrementPage = useCallback(() => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1);
  }, [currentPage, setCurrentPage]);
  const incrementPage = useCallback(() => {
    if (currentPage !== totalPages) setCurrentPage(currentPage + 1);
  }, [currentPage, setCurrentPage, totalPages]);
  const canDecrementPage = useMemo(() => currentPage !== 1, [currentPage]);
  const canIncrementPage = useMemo(() => currentPage < totalPages, [currentPage, totalPages]);
  return (
    <PaginationContainer>
      <PaginationButton ariaLabel="Back Page" disabled={!canDecrementPage} onClick={decrementPage} title="Back Page">
        <Icon glyph="ChevronLeft" fill={canDecrementPage ? ENABLED_COLOR : DISABLED_COLOR} />
      </PaginationButton>
      <PaginationText>
        <strong>
          {currentPage}/{totalPages}
        </strong>
      </PaginationText>
      <PaginationButton
        ariaLabel="Forward Page"
        disabled={!canIncrementPage}
        onClick={incrementPage}
        title="Forward Page"
      >
        <Icon glyph="ChevronRight" fill={canIncrementPage ? ENABLED_COLOR : DISABLED_COLOR} />
      </PaginationButton>
    </PaginationContainer>
  );
};

export default Pagination;
