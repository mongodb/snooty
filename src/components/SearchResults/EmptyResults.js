import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import Icon from '@leafygreen-ui/icon';
import { uiColors } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';

const EmptyStateWrapper = styled('div')`
  grid-area: empty;
  place-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 340px;
`;

const boldStyle = css`
  font-size: 18px;
  letter-spacing: 0.5px;
  line-height: 21px;
  color: ${uiColors.black};
  font-weight: bolder;
`;

const EmptyStateText = styled('p')`
  font-family: Akzidenz;
  text-align: center;
  line-height: ${theme.size.medium};
  margin-bottom: ${theme.size.default};
  ${({ isBold }) => isBold && boldStyle};
`;

const MagnifyingGlass = styled(Icon)`
  color: ${uiColors.black};
  height: 40px;
  width: 40px;
  margin-bottom: ${theme.size.medium};
`;

const EmptyResults = () => (
  <EmptyStateWrapper>
    <MagnifyingGlass glyph="MagnifyingGlass" height="40" />
    <EmptyStateText isBold>Search MongoDB Documentation</EmptyStateText>
    <EmptyStateText>
      Find guides, examples, and best practices for working with the MongoDB data platform.
    </EmptyStateText>
  </EmptyStateWrapper>
);

export default EmptyResults;
