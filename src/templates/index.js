import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LandingPageCards from '../components/LandingPageCards';
import { findKeyValuePair } from '../util';

export default class Index extends Component {
  constructor(propsFromServer) {
    super(propsFromServer);
    this.state = {
      name: 'Guides',
      guides: [],
    };
  }

  componentDidMount() {
    const { pageContext } = this.props;
    const guides = findKeyValuePair(pageContext.__refDocMapping.index.ast.children, 'name', 'guide-index');
    this.setState({ guides: guides.children });
  }

  render() {
    const { pageContext } = this.props;
    const { guides, name } = this.state;

    if (guides.length === 0) {
      return null;
    }

    return (
      <div className="content">
        <div className="guide-category-list">
          <div className="section" id="guides">
            <h1>
              {name}
              <a className="headerlink" href="#guides" title="Permalink to this headline">
                ¶
              </a>
            </h1>
            <LandingPageCards guides={guides} refDocMapping={pageContext.__refDocMapping} />
          </div>
        </div>
      </div>
    );
  }
}

Index.propTypes = {
  pageContext: PropTypes.shape({
    __refDocMapping: PropTypes.shape({
      index: PropTypes.shape({
        ast: PropTypes.object,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};
