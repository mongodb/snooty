import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Footer from '../components/Footer';
import { getNestedValue } from '../utils/get-nested-value';
import Navbar from '../components/Navbar';
import Breadcrumbs from '../components/Breadcrumbs';
import InternalPageNav from '../components/InternalPageNav';
import Sidebar from '../components/Sidebar';
import DocumentBody from '../components/DocumentBody';
import { Helmet } from 'react-helmet';
import { getPlaintextTitle } from '../utils/get-plaintext-title.js';
import { GetWindowSize } from '../hooks/get-window-size.js';
import style from '../styles/navigation.module.css';

const Document = props => {
  const {
    pageContext: {
      slug,
      __refDocMapping,
      metadata: { parentPaths, publishedBranches, slugToTitle: slugTitleMapping, toctree, toctreeOrder },
    },
    ...rest
  } = props;

  const title = getPlaintextTitle(getNestedValue([slug], slugTitleMapping));

  const windowSize = GetWindowSize();
  const minWindowSize = 1093; /* Specific value from docs-tools/themes/mongodb/src/css/mongodb-base.css */

  const [showLeftColumn, setShowLeftColumn] = useState(windowSize.width > minWindowSize);

  const toggleLeftColumn = () => {
    setShowLeftColumn(!showLeftColumn);
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Navbar />
      <div className="content">
        {showLeftColumn && (
          <div className={`left-column ${style.leftColumn}`} id="left-column">
            <Sidebar
              slug={slug}
              publishedBranches={publishedBranches}
              toctreeData={toctree}
              toggleLeftColumn={toggleLeftColumn}
            />
          </div>
        )}
        <div className="main-column" id="main-column">
          {!showLeftColumn && (
            <span className={`showNav ${style.showNav}`} id="showNav" onClick={toggleLeftColumn}>
              Navigation
            </span>
          )}
          <div className="document">
            <div className="documentwrapper">
              <div className="bodywrapper">
                <div className="body">
                  <Breadcrumbs parentPaths={getNestedValue([slug], parentPaths)} slugTitleMapping={slugTitleMapping} />
                  <DocumentBody
                    refDocMapping={__refDocMapping}
                    slug={slug}
                    slugTitleMapping={slugTitleMapping}
                    {...rest}
                  />
                  <InternalPageNav slug={slug} slugTitleMapping={slugTitleMapping} toctreeOrder={toctreeOrder} />
                  <Footer />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
