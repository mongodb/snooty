import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import StyledLink from './StyledLink';
import { normalizePath } from '../utils/normalize-path';

const RefRole = ({ nodeData: { children, domain, fileid, name, url }, slug }) => {
  // Render intersphinx target links
  if (url) {
    return (
      <StyledLink to={url}>
        {children.map((node, i) => (
          <ComponentFactory key={i} nodeData={node} />
        ))}
      </StyledLink>
    );
  }

  // Render internal target and page links
  let link = '';
  if (fileid) {
    let [filename, html_id] = fileid;
    if (filename === 'index') filename = '/';

    if (filename === slug) {
      // Internal page link
      link = `#${html_id}`;
    } else if (html_id === '') {
      // :doc: link
      link = filename;
    } else {
      link = `${filename}/#${html_id}`;
    }
  }

  return (
    <StyledLink to={normalizePath(link)}>
      {children.map((node, i) => (
        <ComponentFactory key={i} nodeData={node} />
      ))}
    </StyledLink>
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
