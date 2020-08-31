import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import Link from './Link';

const RefRole = ({ nodeData: { children, domain, fileid, name, url }, slug }) => {
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

  // Render internal target and page links
  let link = '';
  if (fileid) {
    const [filename, html_id] = fileid;
    link = filename === slug ? `#${html_id}` : `${filename}#${html_id}`;
  }

  return (
    <Link to={link} className="reference internal">
      {children.map((node, i) => (
        <ComponentFactory key={i} nodeData={node} />
      ))}
    </Link>
  );
};

RefRole.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    domain: PropTypes.string.isRequired,
    fileid: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string.isRequired,
    url: PropTypes.string,
  }).isRequired,
  slug: PropTypes.string.isRequired,
};

export default RefRole;
