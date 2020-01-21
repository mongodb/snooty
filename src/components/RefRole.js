import React from 'react';
import PropTypes from 'prop-types';
import Link from './Link';

// TODO: Update with correct formatting/class names upon completion of DOCSP-7569
const RefRole = ({ nodeData: { domain, fileid, name, target, url }, slug }) => {
  // Render intersphinx target links
  if (url) {
    return (
      <Link to={url} className="reference external">
        <code className={`xref ${domain} ${domain}-${name} docutils literal`}>
          <span className="pre">{target}</span>
        </code>
      </Link>
    );
  }

  // Render internal target links
  const link = fileid === slug ? `#${target}` : `${fileid}#${target}`;
  return (
    <Link to={link} className="reference internal">
      <span className={`${domain} ${domain}-ref`}>{target}</span>
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
  slug: PropTypes.string.isRequired,
};

export default RefRole;
