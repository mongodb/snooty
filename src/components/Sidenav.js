import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import Loadable from '@loadable/component';
import Sidebar from './Sidebar';
import { SidebarContext } from './sidebar-context';
import useScreenSize from '../hooks/useScreenSize';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import style from '../styles/navigation.module.css';
import { isBrowser } from '../utils/is-browser';

const ProductsList = Loadable(() => import('./ProductsList'));

const Sidenav = ({ pageContext, showAllProducts }) => {
  const {
    metadata: { publishedBranches, toctree },
    slug,
  } = pageContext;
  const { isSidebarMenuOpen, setIsSidebarMenuOpen } = useContext(SidebarContext);
  const { isTabletOrMobile } = useScreenSize();
  const { project } = useSiteMetadata();
  // TODO: (DOP-1839) Check if this styling is still necessary after current Sidebar is replaced with the LG Sidebar
  /* Add the postRender CSS class without disturbing pre-render functionality */
  const renderStatus = isBrowser ? style.postRender : '';

  const toggleLeftColumn = () => {
    setIsSidebarMenuOpen(!isSidebarMenuOpen);
  };

  useEffect(() => {
    setIsSidebarMenuOpen(!isTabletOrMobile);
  }, [isTabletOrMobile, setIsSidebarMenuOpen]);

  return (
    <div>
      {!isBrowser || isSidebarMenuOpen ? (
        <div
          className={`left-column ${style.leftColumn} ${renderStatus}`}
          css={css`
            grid-area: sidebar;
            width: 330px;
          `}
          id="left-column"
        >
          {/* 
            Temporarily show either the ProductsList or the Sidebar content (but not both) due to issues
            with legacy Sidebar css and its positioning. TODO: Refactor when implementing new Sidenav
            (DOP-1839)
          */}
          {showAllProducts ? (
            <ProductsList />
          ) : (
            <Sidebar
              slug={slug}
              publishedBranches={publishedBranches}
              toctreeData={toctree}
              toggleLeftColumn={toggleLeftColumn}
            />
          )}
        </div>
      ) : (
        <span className={`showNav ${style.showNav} ${renderStatus}`} id="showNav" onClick={toggleLeftColumn}>
          Navigation
        </span>
      )}
    </div>
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
  showAllProducts: PropTypes.bool,
};

export default Sidenav;
