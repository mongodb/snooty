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
    const guides = this.findGuideProperty(pageContext.__refDocMapping.index.ast.children, 'guide-index');
    this.setState({ guides: guides.children });
  }

  findGuideProperty = (nodes, propertyName) => {
    let result;
    const iter = node => {
      if (node.name === propertyName) {
        result = node;
        return true;
      }
      return Array.isArray(node.children) && node.children.some(iter);
    };

    nodes.some(iter);
    return result;
  };

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
