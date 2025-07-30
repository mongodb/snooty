import React from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import Badge, { Variant } from '@leafygreen-ui/badge';
import { getPlaintext } from '../utils/get-plaintext';
import { theme } from '../theme/docsTheme';
import { CommunityDriverPill } from '../types/ast';
import Link from './Link';

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
  variant?: keyof typeof communityPillVariants;
  text?: string;
};

const CommunityPillLink = ({ nodeData, variant = 'lightGray', text = 'community built' }: CommunityPillLinkProps) => {
  return (
    <div className={cx(pillLinkStyle)}>
      {nodeData && nodeData.argument && nodeData.options.url && (
        <Link to={nodeData.options.url}>{getPlaintext(nodeData.argument)}</Link>
      )}
      <Badge variant={communityPillVariants[variant]}>{text}</Badge>
    </div>
  );
};

export default CommunityPillLink;
