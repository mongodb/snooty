import React from 'react';
import PropTypes from 'prop-types';
import Badge from '@leafygreen-ui/badge';
import Link from '../Link';

const CommunityPillLink = ({
  nodeData: {
    children: [{ value }],
  },
}) => {
  let [label, link] = value.split('<');
  if (link) {
    link = link.split('>')[0];
    label = label.trim();
  }

  return (
    <span>
      <Link to={link}>{label}</Link> <Badge variant="lightgray">{'community built'}</Badge>
    </span>
  );
};

CommunityPillLink.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default CommunityPillLink;
