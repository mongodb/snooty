import React from 'react';
import PropTypes from 'prop-types';
import Badge from '@leafygreen-ui/badge';
import { getPlaintext } from '../utils/get-plaintext';
import Link from './Link';

const CommunityPillLink = ({
  nodeData: {
    argument,
    options: { url },
  },
}) => {
  return (
    <div>
      <Link to={url}>{getPlaintext(argument)}</Link>
      <Badge variant="lightgray">{'community built'}</Badge>
    </div>
  );
};

CommunityPillLink.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object).isRequired,
    options: PropTypes.shape({ url: PropTypes.string.isRequired }),
  }).isRequired,
};

export default CommunityPillLink;
