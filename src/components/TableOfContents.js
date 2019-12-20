import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TOCNode from './TOCNode';
import { TOCContext } from './toc-context';
import { isBrowser } from '../utils/is-browser';

/**
 * Overall Table of Contents component, which manages open sections as children
 */
const TableOfContents = ({ toctreeData }) => {
  // Want to check this on each re-render
  let currentPage;
  if (isBrowser()) {
    currentPage = window.location.pathname;
  }
  const { slug, url, children } = toctreeData;
  const target = url || slug;
  const isExternalLink = !!url;
  const linkProps = {};
  if (isExternalLink) {
    linkProps.href = target;
  } else {
    linkProps.to = target;
  }
  const [activeSection, setActiveSection] = useState(currentPage);
  const toggleDrawer = newSlug => {
    if (activeSection === newSlug) {
      setActiveSection(null);
    } else {
      setActiveSection(newSlug);
    }
  };

  return (
    <TOCContext.Provider value={{ activeSection, toggleDrawer }}>
      <ul className="current">
        {children.map(c => {
          const key = c.slug || c.url;
          return <TOCNode node={c} key={key} />;
        })}
      </ul>
    </TOCContext.Provider>
  );
};

TableOfContents.propTypes = {
  toctreeData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string,
    url: PropTypes.string,
    children: PropTypes.array.isRequired,
    options: PropTypes.shape({
      drawer: PropTypes.bool,
      styles: PropTypes.objectOf(PropTypes.string),
    }),
  }).isRequired,
};

export default TableOfContents;
