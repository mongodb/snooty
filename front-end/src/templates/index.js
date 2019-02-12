import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from '../components/Card';

export default class Index extends Component {
  constructor(propsFromServer) {
    super(propsFromServer);
    const { pageContext } = this.props;
    this.state = {
      name: 'Guides',
      description: 'Getting Started',
      guides: pageContext.__refDocMapping.index.ast.children[1].children[2].children,
      // guides: pageContext.__refDocMapping.index.ast.children[3].children
    };
  }

  render() {
    const { description, guides, name } = this.state;
    const { pageContext } = this.props;
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
