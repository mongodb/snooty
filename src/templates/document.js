import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from '../components/ComponentFactory';
import DefaultLayout from '../components/layout';
import Footer from '../components/Footer';
import { getNestedValue } from '../utils/get-nested-value';

const Document = props => {
  const {
    '*': pageSlug,
    pageContext: { __refDocMapping },
  } = props;
  const pageNodes = getNestedValue([pageSlug || 'index', 'ast', 'children'], __refDocMapping) || [];
  return (
    <DefaultLayout>
      <div className="content">
        <div id="main-column" className="main-column">
          <span className="showNav" id="showNav">
            Navigation
          </span>
          <div className="document">
            <div className="documentwrapper">
              <div className="bodywrapper">
                <div className="body">
                  {pageNodes.map((child, index) => (
                    <ComponentFactory key={index} nodeData={child} refDocMapping={__refDocMapping} />
                  ))}
                  <Footer />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

Document.propTypes = {
  '*': PropTypes.string.isRequired,
  pageContext: PropTypes.shape({
    __refDocMapping: PropTypes.shape({
      index: PropTypes.shape({
        ast: PropTypes.object,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default Document;
