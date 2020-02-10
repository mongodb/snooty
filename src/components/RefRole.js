import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import Link from './Link';

// TODO: Update with correct formatting/class names upon completion of DOCSP-7569
const RefRole = ({ nodeData: { children, domain, fileid, name, target, url }, slug }) => {
  // Render intersphinx target links
  if (url) {
    return (
      <Link to={url} className="reference external">
        {children.map((node, i) => (
          <ComponentFactory key={i} nodeData={node} />
        ))}
      </Link>
    );
  }

  // Render internal target links
  const link = fileid === slug ? `#${target}` : `${fileid}#${target}`;
  return (
    <Link to={link} className="reference internal">
      <span className={`${domain} ${domain}-ref`}>
        {children.map((node, i) => (
          <ComponentFactory key={i} nodeData={node} />
        ))}
      </span>
    </Link>
  );
};

RefRole.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
    domain: PropTypes.string.isRequired,
    fileid: PropTypes.string,
    name: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
    url: PropTypes.string,
  }).isRequired,
  slug: PropTypes.string.isRequired,
};

export default RefRole;
