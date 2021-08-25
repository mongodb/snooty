import React, { useLayoutEffect, useRef, useState } from 'react';
import { css } from '@emotion/core';
import Link from './Link';
import VersionDropdown from './VersionDropdown';
import TableOfContents from './TableOfContents';
import { formatText } from '../utils/format-text';
import style from '../styles/sidebar.module.css';
import { theme } from '../theme/docsTheme';

const Sidebar = ({ slug, publishedBranches, toctreeData, toggleLeftColumn }) => {
  const { title } = toctreeData;

  // Calculate height of the fixed header so that the TOC can occupy the rest of the vertical space.
  const [fixedHeight, setFixedHeight] = useState(0);
  const fixedHeading = useRef(null);
  useLayoutEffect(() => {
    setFixedHeight(fixedHeading.current.clientHeight);
  }, []);

  // Replace styling in sidebar.module.css for .sphinxsidebar if flag is removed before Docs IA update
  const consistentNavHeightOffset =
    process.env.GATSBY_FEATURE_FLAG_CONSISTENT_NAVIGATION &&
    css`
      top: 56px !important;
      @media ${theme.screenSize.largeAndUp} {
        top: 87px !important;
      }
      height: calc(100vh - 87px) !important;
    `;

  return (
    <aside className={`sidebar ${style.sidebar}`} id="sidebar">
      <div className={`sphinxsidebar ${style.sphinxsidebar}`} css={consistentNavHeightOffset} id="sphinxsidebar">
        <div id="sphinxsidebarwrapper" className="sphinxsidebarwrapper">
          <div ref={fixedHeading}>
            <span className="closeNav" id="closeNav" onClick={toggleLeftColumn} style={{ cursor: 'pointer' }}>
              Close ×
            </span>
            <h3>
              <Link className="index-link" to="/">
                {formatText(title)}
              </Link>
            </h3>
            {publishedBranches && <VersionDropdown slug={slug} publishedBranches={publishedBranches} />}
          </div>
          <TableOfContents toctreeData={toctreeData} height={fixedHeight} activeSection={slug} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
