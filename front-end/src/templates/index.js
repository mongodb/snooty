import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LandingPageCards from '../components/LandingPageCards';

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
    this.findGuideIndex(pageContext.__refDocMapping.index.ast);
  }

  findGuideIndex(node) {
    if (node.name === 'guide-index') {
      this.setState({ guides: node.children });
      return node.children;
    }

    if (node.children) {
      node.children.forEach(child => {
        const result = this.findGuideIndex(child);

        if (result !== false) {
          return result;
        }
        return false;
      });
    }

    return false;
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
