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
    '*': pageSlug,
    pageContext: { __refDocMapping },
  } = props;
  const pageNodes = getNestedValue([pageSlug || 'index', 'ast', 'children'], __refDocMapping) || [];

  const getSubstitutions = () => {
    const fileSubstitutions = findAllKeyValuePairs(pageNodes, 'type', 'substitution_definition');

    const includes = findAllKeyValuePairs(pageNodes, 'name', 'include');
    const includeContents = includes
      .map(include => getIncludeFile(__refDocMapping, getNestedValue(['argument', 0, 'value'], include)))
      .flat();
    const includeSubstitutions = findAllKeyValuePairs(includeContents, 'type', 'substitution_definition');

    const substitutions = fileSubstitutions.concat(includeSubstitutions);
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
