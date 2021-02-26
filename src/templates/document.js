import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getNestedValue } from '../utils/get-nested-value';
import Breadcrumbs from '../components/Breadcrumbs';
import InternalPageNav from '../components/InternalPageNav';
import Sidebar from '../components/Sidebar';
import RightColumn from '../components/RightColumn';
import TabSelectors from '../components/TabSelectors';
import Contents from '../components/Contents';
import useScreenSize from '../hooks/useScreenSize.js';
import style from '../styles/navigation.module.css';
import { isBrowser } from '../utils/is-browser.js';
import { css } from '@emotion/core';

const landingCSS = css`
  max-width: 1172px !important;

  ${'' /* All paragraphs contained in a parent class that is not named footer */}
  p {
    max-width: 500px !important;
  }
`;

const Document = ({
  children,
  pageContext: {
    slug,
    page,
    template,
    metadata: { parentPaths, publishedBranches, slugToTitle: slugTitleMapping, toctree, toctreeOrder },
  },
}) => {
  const { isTabletOrMobile } = useScreenSize();
  const [showLeftColumn, setShowLeftColumn] = useState(!isTabletOrMobile);
  /* Add the postRender CSS class without disturbing pre-render functionality */
  const renderStatus = isBrowser ? style.postRender : '';
  const pageOptions = page?.options;
  const showPrevNext = !(pageOptions && pageOptions.noprevnext === '');
  const isLanding = template === 'landing';

  const toggleLeftColumn = () => {
    setShowLeftColumn(!showLeftColumn);
  };

  useEffect(() => {
    setShowLeftColumn(!isTabletOrMobile);
  }, [isTabletOrMobile]);

  return (
    <div className="content">
      <div>
        {(!isBrowser || showLeftColumn) && (
          <div className={`left-column ${style.leftColumn} ${renderStatus}`} id="left-column">
            <Sidebar
              slug={slug}
              publishedBranches={publishedBranches}
              toctreeData={toctree}
              toggleLeftColumn={toggleLeftColumn}
            />
          </div>
        )}
      </div>
      <div id="main-column" className="main-column" css={isLanding && landingCSS}>
        {(!isBrowser || !showLeftColumn) && (
          <span className={`showNav ${style.showNav} ${renderStatus}`} id="showNav" onClick={toggleLeftColumn}>
            Navigation
          </span>
        )}
        <div className="document">
          <div className="documentwrapper">
            <div className="bodywrapper">
              <div className="body">
                <Breadcrumbs parentPaths={getNestedValue([slug], parentPaths)} slugTitleMapping={slugTitleMapping} />
                <div>{children}</div>
                {showPrevNext && (
                  <InternalPageNav slug={slug} slugTitleMapping={slugTitleMapping} toctreeOrder={toctreeOrder} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <RightColumn>
        <TabSelectors />
        <Contents />
      </RightColumn>
    </div>
  );
};

Document.propTypes = {
  pageContext: PropTypes.shape({
    page: PropTypes.shape({
      children: PropTypes.array,
      options: PropTypes.object,
    }).isRequired,
    parentPaths: PropTypes.arrayOf(PropTypes.string),
    slug: PropTypes.string.isRequired,
    slugTitleMapping: PropTypes.shape({
      [PropTypes.string]: PropTypes.string,
    }),
    toctree: PropTypes.object,
    toctreeOrder: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default Document;
