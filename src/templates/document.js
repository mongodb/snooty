import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Footer from '../components/Footer';
import { getNestedValue } from '../utils/get-nested-value';
import Navbar from '../components/Navbar';
import Breadcrumbs from '../components/Breadcrumbs';
import InternalPageNav from '../components/InternalPageNav';
import Sidebar from '../components/Sidebar';
import DocumentBody from '../components/DocumentBody';
import { useWindowSize } from '../hooks/use-window-size.js';
import style from '../styles/navigation.module.css';
import { isBrowser } from '../utils/is-browser.js';

const Document = props => {
  const {
    pageContext: {
      slug,
      __refDocMapping,
      metadata: { parentPaths, publishedBranches, slugToTitle: slugTitleMapping, toctree, toctreeOrder },
    },
    location,
    ...rest
  } = props;

  const windowSize = useWindowSize();
  const minWindowWidth = 1093; /* Specific value from docs-tools/themes/mongodb/src/css/mongodb-base.css */

  const [showLeftColumn, setShowLeftColumn] = useState(windowSize.width > minWindowWidth);
  /* Add the postRender CSS class without disturbing pre-render functionality */
  const renderStatus = isBrowser ? style.postRender : '';
  const pageOptions = getNestedValue(['ast', 'options'], __refDocMapping);
  const showPrevNext = !(pageOptions && pageOptions.noprevnext === '');
  const toggleLeftColumn = () => {
    setShowLeftColumn(!showLeftColumn);
  };

  return (
    <React.Fragment>
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
        <div id="main-column" className="main-column">
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
                  <DocumentBody refDocMapping={__refDocMapping} slug={slug} {...rest} />
                  {showPrevNext && (
                    <InternalPageNav slug={slug} slugTitleMapping={slugTitleMapping} toctreeOrder={toctreeOrder} />
                  )}
                  <Footer />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Navbar />
    </React.Fragment>
  );
};

Document.propTypes = {
  pageContext: PropTypes.shape({
    __refDocMapping: PropTypes.shape({
      ast: PropTypes.shape({
        children: PropTypes.array,
      }).isRequired,
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
