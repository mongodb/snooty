import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TOCNode from './TOCNode';

/**
 * Overall Table of Contents component, which manages open sections as children
 */
const TableOfContents = ({ toctreeData }) => {
  // Want to check this on each re-render
  const currentPage = window.location.pathname;
  const { title, slug, url, children } = toctreeData;
  const target = url || slug;
  const [activeSection, setActiveSection] = useState(currentPage);
  const toggleDrawer = newSlug => {
    if (activeSection === newSlug) {
      setActiveSection(null);
    } else {
      setActiveSection(newSlug);
    }
  };

  return (
    <>
      <h3>
        <a href={target}>{title}</a>
      </h3>
      <ul className="current">
        {children.map(c => (
          <TOCNode node={c} toggleDrawer={toggleDrawer} activeSection={activeSection} key={c.title} />
        ))}
      </ul>
    </>
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
