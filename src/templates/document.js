import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from '../components/ComponentFactory';
import DefaultLayout from '../components/layout';
import Footer from '../components/Footer';
import { getIncludeFile } from '../utils/get-include-file';
import { getNestedValue } from '../utils/get-nested-value';
import { findAllKeyValuePairs } from '../utils/find-all-key-value-pairs';

const Document = props => {
  const {
    pageContext: { includes, pageMetadata, __refDocMapping },
  } = props;
  const pageNodes = getNestedValue(['ast', 'children'], __refDocMapping) || [];

  // Identify and save all substitutions as defined on this page and in its included files
  const getSubstitutions = () => {
    // Find substitutions on page
    const pageSubstitutions = findAllKeyValuePairs(pageNodes, 'type', 'substitution_definition');

    // Find all include nodes on the page, get each include's contents, and find all substitutions in each include
    const includeFilenames = findAllKeyValuePairs(pageNodes, 'name', 'include');
    const includeContents = includeFilenames.map(fileNode =>
      getIncludeFile(includes, getNestedValue(['argument', 0, 'value'], fileNode))
    );
    const includeSubstitutions = findAllKeyValuePairs(includeContents, 'type', 'substitution_definition');

    // Merge page and include substitutions.
    // Create a map wherein each key is the word to be replaced, and each value is the nodes to replace it with.
    const substitutions = pageSubstitutions.concat(includeSubstitutions);
    return substitutions.reduce((map, sub) => {
      map[sub.name] = sub.children; // eslint-disable-line no-param-reassign
      return map;
    }, {});
  };

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
                    <ComponentFactory
                      key={index}
                      nodeData={child}
                      refDocMapping={__refDocMapping}
                      includes={includes}
                      pageMetadata={pageMetadata}
                      substitutions={getSubstitutions()}
                    />
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
  pageContext: PropTypes.shape({
    __refDocMapping: PropTypes.shape({
      ast: PropTypes.shape({
        children: PropTypes.array,
      }).isRequired,
    }).isRequired,
    includes: PropTypes.objectOf(PropTypes.object),
    pageMetadata: PropTypes.objectOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Document;
