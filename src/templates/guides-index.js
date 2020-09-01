import React from 'react';
import PropTypes from 'prop-types';
import LandingPageCards from '../components/LandingPage/LandingPageCards';
import { findKeyValuePair } from '../utils/find-key-value-pair';
import { getNestedValue } from '../utils/get-nested-value';
import Navbar from '../components/Navbar';

const Index = ({ pageContext: { guidesMetadata, page } }) => {
  const guides = findKeyValuePair(getNestedValue(['ast', 'children'], page), 'name', 'guide-index') || [];

  return (
    <React.Fragment>
      <div className="content">
        <div className="guide-category-list">
          <div className="section" id="guides">
            <h1>
              Guides
              <a className="headerlink" href="#guides" title="Permalink to this headline">
                ¶
              </a>
            </h1>
            <LandingPageCards guides={guides.children} guidesMetadata={guidesMetadata} />
          </div>
        </div>
      </div>
      <Navbar />
    </React.Fragment>
  );
};

Index.propTypes = {
  pageContext: PropTypes.shape({
    guidesMetadata: PropTypes.objectOf(PropTypes.object).isRequired,
    page: PropTypes.shape({
      ast: PropTypes.shape({
        children: PropTypes.array,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default Index;
