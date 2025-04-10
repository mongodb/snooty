import React from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import PropTypes from 'prop-types';
import Badge, { Variant } from '@leafygreen-ui/badge';
import { getPlaintext } from '../utils/get-plaintext';
import { theme } from '../theme/docsTheme';
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

const CommunityPillLink = ({ nodeData, variant = 'lightGray', text = 'community built' }) => {
  const { argument, options: { url } = {} } = nodeData || {};

  return (
    <div className={cx(pillLinkStyle)}>
      {nodeData && argument && url && <Link to={url}>{getPlaintext(argument)}</Link>}
      <Badge variant={communityPillVariants[variant]}>{text}</Badge>
    </div>
  );
};

CommunityPillLink.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object).isRequired,
    options: PropTypes.shape({ url: PropTypes.string.isRequired }),
  }),
  variant: PropTypes.oneOf(Object.values(communityPillVariants)),
  text: PropTypes.string,
};

export default CommunityPillLink;
