import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from '../components/Card';

export default class Index extends Component {
  constructor(propsFromServer) {
    super(propsFromServer);
    this.state = {
      name: 'Guides',
      description: 'Getting Started',
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
    const { description, guides, name } = this.state;

    if (guides.length === 0) {
      return null;
    }

    const allCards = guides.map((card, index) => (
      <Card card={card} key={index} cardId={index} refDocMapping={pageContext.__refDocMapping} />
    ));

    return (
      <div className="content">
        <div className="guide-category-list">
          <div className="section" id="guides">
            <div>
              <h1>
                {name}
                <a className="headerlink" href="#guides" title="Permalink to this headline">
                  ¶
                </a>
              </h1>
              <section className="guide-category">
                <div className="guide-category__title guide-category__title--getting-started">{description}</div>
                <div className="guide-category__guides">{allCards}</div>
              </section>
            </div>
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
