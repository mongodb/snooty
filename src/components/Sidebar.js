import React from 'react';
import Link from './Link';
import VersionDropdown from './VersionDropdown';
import TableOfContents from './TableOfContents';
import { formatText } from '../utils/format-text';
import style from '../styles/sidebar.module.css';

const Sidebar = ({ slug, publishedBranches, toctreeData, toggleLeftColumn }) => {
  const { title } = toctreeData;
  return (
    <aside className={`sidebar ${style.sidebar}`} id="sidebar">
      <div className={`sphinxsidebar ${style.sphinxsidebar}`} id="sphinxsidebar">
        <div id="sphinxsidebarwrapper" className="sphinxsidebarwrapper">
          <span
            className={`closeNav ${style.closeNav}`}
            id="closeNav"
            onClick={toggleLeftColumn}
            style={{ cursor: 'pointer' }}
          >
            Close ×
          </span>
          <h3>
            <Link className="index-link" to="/">
              {formatText(title)}
            </Link>
          </h3>
          {publishedBranches && <VersionDropdown slug={slug} publishedBranches={publishedBranches} />}
          <TableOfContents toctreeData={toctreeData} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
