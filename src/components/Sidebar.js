import React from 'react';
import { Link } from 'gatsby';
import VersionDropdown from './VersionDropdown';
import TableOfContents from './TableOfContents';
import { formatText } from '../utils/format-text';

const Sidebar = ({ slug, publishedBranches, toctreeData }) => {
  const { title } = toctreeData;
  return (
    <aside className="sidebar" id="sidebar">
      <div className="sphinxsidebar" id="sphinxsidebar">
        <div id="sphinxsidebarwrapper" className="sphinxsidebarwrapper">
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
