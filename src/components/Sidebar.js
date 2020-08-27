import React, { useState } from 'react';
import Link from './Link';
import VersionDropdown from './VersionDropdown';
import TableOfContents from './TableOfContents';
import { formatText } from '../utils/format-text';
import style from '../styles/sidebar.module.css';
import { TOCContext } from './toc-context';

const Sidebar = ({ slug, publishedBranches, toctreeData, toggleLeftColumn }) => {
  const { title } = toctreeData;
  const [activeSection, setActiveSection] = useState(slug === '/' ? 'index' : slug);
  return (
    <aside className={`sidebar ${style.sidebar}`} id="sidebar">
      <div className={`sphinxsidebar ${style.sphinxsidebar}`} id="sphinxsidebar">
        <div id="sphinxsidebarwrapper" className="sphinxsidebarwrapper">
          <span className="closeNav" id="closeNav" onClick={toggleLeftColumn} style={{ cursor: 'pointer' }}>
            Close ×
          </span>
          <TOCContext.Provider value={{ activeSection, setActiveSection }}>
            <h3>
              <Link className="index-link" to="/" onClick={() => setActiveSection('index')}>
                {formatText(title)}
              </Link>
            </h3>
            {publishedBranches && <VersionDropdown slug={slug} publishedBranches={publishedBranches} />}
            <TableOfContents toctreeData={toctreeData} />
          </TOCContext.Provider>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
