import React from 'react';
import styled from '@emotion/styled';
import { Link as LeafyLink } from '@leafygreen-ui/typography';
import Link from './Link';
import { isInternalUrl } from '../utils/is-internal-url';

const StyledLink = styled((props) => (
  <LeafyLink hideExternalIcon={isInternalUrl(props.to)}>
    <Link {...props} />
  </LeafyLink>
))`
  color: inherit;

  > code {
    color: inherit;
  }
`;

export default StyledLink;
