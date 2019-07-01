import React from 'react';
import PropTypes from 'prop-types';
import DefaultLayout from '../components/layout';
import LandingPageCards from '../components/LandingPage/LandingPageCards';
import { findKeyValuePair } from '../utils/find-key-value-pair';
import { getNestedValue } from '../utils/get-nested-value';

const Index = ({ pageContext: { pageMetadata, __refDocMapping } }) => {
  const guides = findKeyValuePair(getNestedValue(['ast', 'children'], __refDocMapping), 'name', 'guide-index') || [];

  return (
    <DefaultLayout>
      <div className="content">
        <div className="guide-category-list">
          <div className="section" id="guides">
            <h1>
              Guides
              <a className="headerlink" href="#guides" title="Permalink to this headline">
                ¶
              </a>
            </h1>
            <LandingPageCards guides={guides.children} pageMetadata={pageMetadata} />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

Index.propTypes = {
  pageContext: PropTypes.shape({
    pageMetadata: PropTypes.shape({
      [PropTypes.string]: PropTypes.object,
    }).isRequired,
    __refDocMapping: PropTypes.shape({
      ast: PropTypes.shape({
        children: PropTypes.array,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default Index;
