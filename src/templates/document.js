import React from 'react';
import PropTypes from 'prop-types';
import Footer from '../components/Footer';
import { getNestedValue } from '../utils/get-nested-value';
import Navbar from '../components/Navbar';
import Breadcrumbs from '../components/Breadcrumbs';
import InternalPageNav from '../components/InternalPageNav';
import Sidebar from '../components/Sidebar';
import DocumentBody from '../components/DocumentBody';

const Document = props => {
  const {
    pageContext: {
      slug,
      __refDocMapping,
      metadata: { parentPaths, publishedBranches, slugToTitle: slugTitleMapping, toctree, toctreeOrder },
    },
    ...rest
  } = props;

  return (
    <React.Fragment>
      <Navbar />
      <div className="content">
        <div id="left-column">
          <Sidebar slug={slug} publishedBranches={publishedBranches} toctreeData={toctree} />
        </div>
        <div id="main-column" className="main-column">
          <span className="showNav" id="showNav">
            Navigation
          </span>
          <div className="document">
            <div className="documentwrapper">
              <div className="bodywrapper">
                <div className="body">
                  <Breadcrumbs parentPaths={getNestedValue([slug], parentPaths)} slugTitleMapping={slugTitleMapping} />
                  <DocumentBody refDocMapping={__refDocMapping} slugTitleMapping={slugTitleMapping} {...rest} />
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
