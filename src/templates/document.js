import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from '../components/ComponentFactory';
import Footer from '../components/Footer';
import { getNestedValue } from '../utils/get-nested-value';
import { isPreviewMode } from '../utils/is-preview-mode';
import Breadcrumbs from '../components/Breadcrumbs';
import InternalPageNav from '../components/InternalPageNav';
import Navbar from '../components/Navbar';
import TOCSidebar from '../components/TOCSidebar';

const Document = props => {
  const {
    addPillstrip,
    footnotes,
    location: { pathname },
    pageContext: {
      pageMetadata,
      parentPaths,
      publishedBranches,
      slug,
      slugTitleMapping,
      toctree,
      toctreeOrder,
      __refDocMapping,
    },
    pillstrips,
    substitutions,
  } = props;
  const pageNodes = getNestedValue(['ast', 'children'], __refDocMapping) || [];

  return (
    <React.Fragment>
      <Navbar />
      <div className="content">
        {!isPreviewMode() && (
          <div id="left-column">
            <TOCSidebar pathname={pathname} publishedBranches={publishedBranches} toctreeData={toctree} />
          </div>
        )}
        <div id="main-column" className="main-column">
          <span className="showNav" id="showNav">
            Navigation
          </span>
          <div className="document">
            <div className="documentwrapper">
              <div className="bodywrapper">
                <div className="body">
                  <Breadcrumbs parentPaths={parentPaths} slugTitleMapping={slugTitleMapping} />
                  {pageNodes.map((child, index) => (
                    <ComponentFactory
                      addPillstrip={addPillstrip}
                      footnotes={footnotes}
                      key={index}
                      nodeData={child}
                      refDocMapping={__refDocMapping}
                      pageMetadata={pageMetadata}
                      pillstrips={pillstrips}
                      substitutions={substitutions}
                    />
                  ))}

                  {!isPreviewMode() && (
                    <InternalPageNav slug={slug} slugTitleMapping={slugTitleMapping} toctreeOrder={toctreeOrder} />
                  )}
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
  addPillstrip: PropTypes.func,
  footnotes: PropTypes.objectOf(PropTypes.object),
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  pageContext: PropTypes.shape({
    __refDocMapping: PropTypes.shape({
      ast: PropTypes.shape({
        children: PropTypes.array,
      }).isRequired,
    }).isRequired,
    pageMetadata: PropTypes.objectOf(PropTypes.object).isRequired,
    parentPaths: PropTypes.arrayOf(PropTypes.string),
    slug: PropTypes.string.isRequired,
    slugTitleMapping: PropTypes.shape({
      [PropTypes.string]: PropTypes.string,
    }).isRequired,
    toctree: PropTypes.object,
    toctreeOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  pillstrips: PropTypes.objectOf(PropTypes.object),
  substitutions: PropTypes.objectOf(PropTypes.array),
};

Document.defaultProps = {
  addPillstrip: () => {},
  footnotes: {},
  pillstrips: {},
  substitutions: {},
};

export default Document;
