import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from '../components/ComponentFactory';
import Footer from '../components/Footer';
import { getNestedValue } from '../utils/get-nested-value';
import Navbar from '../components/Navbar';
import Breadcrumbs from '../components/Breadcrumbs';
import TOCSidebar from '../components/TOCSidebar';

const Document = props => {
  const {
    addPillstrip,
    footnotes,
    pageContext: { pageMetadata, parentPaths, slugTitleMapping, toctree, __refDocMapping },
    pillstrips,
    substitutions,
  } = props;
  const pageNodes = getNestedValue(['ast', 'children'], __refDocMapping) || [];

  return (
    <React.Fragment>
      <Navbar />
      <div className="content">
        <div id="left-column">
          <TOCSidebar toctreeData={toctree} />
        </div>
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
  pageContext: PropTypes.shape({
    __refDocMapping: PropTypes.shape({
      ast: PropTypes.shape({
        children: PropTypes.array,
      }).isRequired,
    }).isRequired,
    pageMetadata: PropTypes.objectOf(PropTypes.object).isRequired,
    parentPaths: PropTypes.arrayOf(PropTypes.string),
    slugTitleMapping: PropTypes.shape({
      [PropTypes.string]: PropTypes.string,
    }).isRequired,
    toctree: PropTypes.object,
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
