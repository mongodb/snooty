import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LandingPageCards from '../components/LandingPage/LandingPageCards';
import { findKeyValuePair } from '../utils/find-key-value-pair';
import { getNestedValue } from '../utils/get-nested-value';
import DefaultLayout from '../components/layout';

const Index = ({ pageContext: { pageTitles, __refDocMapping } }) => {
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
            <LandingPageCards guides={guides.children} refDocMapping={__refDocMapping} pageTitles={pageTitles} />
          </div>
        </div>
      </div>
    </DefaultLayout>
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
