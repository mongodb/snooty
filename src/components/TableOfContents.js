import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TOCSection from './TOCSection';

const TableOfContents = props => {
  const { nodeData } = props;
  const { title, slug, url, children } = nodeData;
  const target = url || slug;
  const activeSlug = window.location.pathname;
  const [activeSection, setActiveSection] = useState(activeSlug);
  const handleDrawer = slug => {
    if (activeSection === slug) {
      setActiveSection(null);
    } else {
      setActiveSection(slug);
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
              <TOCSection sectionData={c} handleDrawer={handleDrawer} activeSection={activeSection} key={c.title} />
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

TableOfContents.propTypes = {
  nodeData: PropTypes.shape({
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
