import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import Sidebar from './Sidebar';
import { SidebarContext } from './sidebar-context';
import useScreenSize from '../hooks/useScreenSize';
import style from '../styles/navigation.module.css';
import { isBrowser } from '../utils/is-browser';

const Sidenav = ({ pageContext }) => {
  const {
    metadata: { publishedBranches, toctree },
    slug,
  } = pageContext;
  const { isSidebarMenuOpen, setIsSidebarMenuOpen } = useContext(SidebarContext);
  const { isTabletOrMobile } = useScreenSize();
  // TODO: (DOP-1839) Check if this styling is still necessary after current Sidebar is replaced with the LG Sidebar
  /* Add the postRender CSS class without disturbing pre-render functionality */
  const renderStatus = isBrowser ? style.postRender : '';

  const toggleLeftColumn = () => {
    setIsSidebarMenuOpen(!isSidebarMenuOpen);
  };

  useEffect(() => {
    setIsSidebarMenuOpen(!isTabletOrMobile);
  }, [isTabletOrMobile, setIsSidebarMenuOpen]);

  return !isBrowser || isSidebarMenuOpen ? (
    <div
      className={`left-column ${style.leftColumn} ${renderStatus}`}
      css={css`
        grid-area: sidebar;
        width: 330px;
      `}
      id="left-column"
    >
      <Sidebar
        slug={slug}
        publishedBranches={publishedBranches}
        toctreeData={toctree}
        toggleLeftColumn={toggleLeftColumn}
      />
    </div>
  ) : (
    <span className={`showNav ${style.showNav} ${renderStatus}`} id="showNav" onClick={toggleLeftColumn}>
      Navigation
    </span>
  );
};

Sidenav.propTypes = {
  pageContext: PropTypes.shape({
    metadata: PropTypes.shape({
      publishedBranches: PropTypes.object,
      toctree: PropTypes.object,
    }).isRequired,
    slug: PropTypes.string,
  }).isRequired,
};

export default Sidenav;
