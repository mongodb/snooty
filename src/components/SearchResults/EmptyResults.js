import React from 'react';
import styled from '@emotion/styled';
import Icon from '@leafygreen-ui/icon';
import { uiColors } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';

const MAGNIFYING_GLASS_SIZE = '40px';
const MAX_WIDTH = '337px';

const MagnifyingGlass = styled(Icon)`
  color: ${uiColors.black};
  height: ${MAGNIFYING_GLASS_SIZE};
  width: ${MAGNIFYING_GLASS_SIZE};
`;

const SupportingText = styled('p')`
  font-size: ${theme.fontSize.default};
  line-height: ${theme.size.medium};
`;

const TitleText = styled('h3')`
  color: ${uiColors.black};
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

const EmptyResults = () => (
  <EmptyStateContainer>
    <MagnifyingGlass glyph="MagnifyingGlass" />
    <TitleText>
      <strong>Search MongoDB Documentation</strong>
    </TitleText>
    <SupportingText>
      Find guides, examples, and best practices for working with the MongoDB data platform.
    </SupportingText>
  </EmptyStateContainer>
);

export default EmptyResults;
