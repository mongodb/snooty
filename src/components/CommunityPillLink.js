import React from 'react';
import PropTypes from 'prop-types';
import Badge, { Variant } from '@leafygreen-ui/badge';
import { getPlaintext } from '../utils/get-plaintext';
import Link from './Link';

const communityPillVariants = {
  darkGray: Variant.DarkGray,
  lightGray: Variant.LightGray,
  red: Variant.Red,
  yellow: Variant.Yellow,
  blue: Variant.Blue,
  green: Variant.Green,
};

/**
 * CommunityPillLink component
 *
 * @param {Object} param0 - The parameters object
 * @param {Object} param0.nodeData - Data for the node
 * @param {String} param0.nodeData.argument - Text to display for Link
 * @param {Object} [param0.nodeData.options] - Options for the node data
 * @param {string} [param0.nodeData.options.url] - URL in the options
 * @param {string} param0.variant - Variant of the community pill link
 * @param {string} [param0.text='community built'] - Text to display, defaults to 'community built'
 * @returns {JSX.Element} The rendered CommunityPillLink component
 */
const CommunityPillLink = ({ nodeData, variant, text = 'community built' }) => {
  const { argument, options: { url } = {} } = nodeData || {};

  return (
    <div>
      {nodeData && argument && url && <Link to={url}>{getPlaintext(argument)}</Link>}
      <Badge variant={communityPillVariants[variant] || Variant.LightGray}>{text}</Badge>
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
