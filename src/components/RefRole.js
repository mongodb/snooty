import React from 'react';
import PropTypes from 'prop-types';
import Link from './Link';

// TODO: Properly render ref_role nodes with links and labels
const RefRole = props => {
  const {
    nodeData: { domain, name, target, url },
  } = props;

  if (url) {
    return (
      <Link to={url} className="reference external">
        <code className={`xref ${domain} ${domain}-${name} docutils literal`}>
          <span className="pre">{target}</span>
        </code>
      </Link>
    );
  }

  return (
    <Link to="" className="reference internal">
      <span className="">RefRole</span>
    </Link>
  );
};

RefRole.propTypes = {
  nodeData: PropTypes.shape({
    domain: PropTypes.string.isRequired,
    fileid: PropTypes.string,
    name: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
    url: PropTypes.string,
  }).isRequired,
};

export default RefRole;
