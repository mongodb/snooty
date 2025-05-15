import React from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import Badge, { Variant } from '@leafygreen-ui/badge';
import { getPlaintext } from '../utils/get-plaintext';
import { theme } from '../theme/docsTheme';
import { CommunityDriverPill } from '../types/ast';
import Link from './Link';

type CommunityPillSnootyVariant = 'darkGray' | 'lightGray' | 'red' | 'yellow' | 'blue' | 'green';

const communityPillVariants = {
  darkGray: Variant.DarkGray,
  lightGray: Variant.LightGray,
  red: Variant.Red,
  yellow: Variant.Yellow,
  blue: Variant.Blue,
  green: Variant.Green,
};

const pillLinkStyle = css`
  :last-of-type {
    margin-bottom: ${theme.size.default};
  }
`;

type CommunityPillLinkProps = {
  nodeData?: CommunityDriverPill;
  variant?: CommunityPillSnootyVariant;
  text?: string;
};

const CommunityPillLink = ({ nodeData, variant = 'lightGray', text = 'community built' }: CommunityPillLinkProps) => {
  const { argument, options: { url } = {} } = nodeData || {};

  return (
    <div className={cx(pillLinkStyle)}>
      {nodeData && argument && url && <Link to={url}>{getPlaintext(argument)}</Link>}
      <Badge variant={communityPillVariants[variant]}>{text}</Badge>
    </div>
  );
};

export default CommunityPillLink;
