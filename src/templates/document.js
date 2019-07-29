import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from '../components/ComponentFactory';
import Footer from '../components/Footer';
import { getNestedValue } from '../utils/get-nested-value';
import Navbar from '../components/Navbar';

const Document = props => {
  const {
    pageContext: { includes, pageMetadata, __refDocMapping },
    substitutions,
  } = props;
  const pageNodes = getNestedValue(['ast', 'children'], __refDocMapping) || [];

  return (
    <React.Fragment>
      <Navbar />
      <div className="content">
        <div id="main-column" className="main-column">
          <span className="showNav" id="showNav">
            Navigation
          </span>
          <div className="document">
            <div className="documentwrapper">
              <div className="bodywrapper">
                <div className="body">
                  <div className="bc" />
                  {pageNodes.map((child, index) => (
                    <ComponentFactory
                      key={index}
                      nodeData={child}
                      refDocMapping={__refDocMapping}
                      includes={includes}
                      pageMetadata={pageMetadata}
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
  pageContext: PropTypes.shape({
    __refDocMapping: PropTypes.shape({
      ast: PropTypes.shape({
        children: PropTypes.array,
      }).isRequired,
    }).isRequired,
    includes: PropTypes.objectOf(PropTypes.object),
    pageMetadata: PropTypes.objectOf(PropTypes.object).isRequired,
  }).isRequired,
  substitutions: PropTypes.objectOf(PropTypes.array).isRequired,
};

export default Document;
