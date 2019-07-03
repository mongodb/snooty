import React from 'react';
import PropTypes from 'prop-types';
import LandingPageCards from '../components/LandingPage/LandingPageCards';
import { findKeyValuePair } from '../utils/find-key-value-pair';
import { getNestedValue } from '../utils/get-nested-value';

const Index = ({ pageContext }) => {
  const guides = findKeyValuePair(
    getNestedValue(['__refDocMapping', 'index', 'ast', 'children'], pageContext),
    'name',
    'guide-index'
  );

  return (
    <div className="content">
      <div className="guide-category-list">
        <div className="section" id="guides">
          <h1>
            Guides
            <a className="headerlink" href="#guides" title="Permalink to this headline">
              ¶
            </a>
          </h1>
          <LandingPageCards guides={guides.children} refDocMapping={pageContext.__refDocMapping} />
        </div>
      </div>
    </div>
  );
};

Index.propTypes = {
  pageContext: PropTypes.shape({
    __refDocMapping: PropTypes.shape({
      index: PropTypes.shape({
        ast: PropTypes.object,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default Index;
