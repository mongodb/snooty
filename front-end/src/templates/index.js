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
    const { description, guides, name } = this.state;

    if (guides.length === 0) {
      return null;
    }

    const allCards = guides.map((card, index) => {
      let completionTime;
      if (card.name === 'card') {
        const cardSlug = card.argument[0].value;
        completionTime = this.findGuideProperty(pageContext.__refDocMapping[cardSlug].ast.children, 'time').argument[0]
          .value;
      }
      return (
        <Card
          card={card}
          key={index}
          cardId={index}
          refDocMapping={pageContext.__refDocMapping}
          time={completionTime}
        />
      );
    });

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
