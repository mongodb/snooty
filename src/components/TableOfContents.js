import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TOCSection from './TOCSection';

const CURRENT_PAGE = window.location.pathname;
/**
 * Overall Table of Contents component, which manages open sections as children
 */
const TableOfContents = ({ toctreeData }) => {
  const { title, slug, url, children } = toctreeData;
  const target = url || slug;
  const [activeSection, setActiveSection] = useState(CURRENT_PAGE);
  const toggleDrawer = newSlug => {
    if (activeSection === newSlug) {
      setActiveSection(null);
    } else {
      setActiveSection(newSlug);
    }
  };

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sphinxsidebar" id="sphinxsidebar">
        <div id="sphinxsidebarwrapper" className="sphinxsidebarwrapper">
          <h3>
            <a href={target}>{title}</a>
          </h3>
          <ul className="current">
            {children.map(c => (
              <TOCSection sectionData={c} toggleDrawer={toggleDrawer} activeSection={activeSection} key={c.title} />
            ))}
          </ul>
        </div>
      </div>
    </aside>
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
