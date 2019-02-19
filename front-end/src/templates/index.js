import React, { Component } from 'react';
import Card from '../components/Card';

export default class Index extends Component {

  constructor(propsFromServer) {
    super(propsFromServer);
    this.state = {
      name: 'Guides',
      description: 'Getting Started',
      guides: [],
    };
    console.log(11, this.props.pageContext.__refDocMapping);
  }
  
  componentDidMount() {
    this.findGuideIndex(this.props.pageContext.__refDocMapping.index.ast);
  }

  findGuideIndex(node) {
    if (node.name === 'guide-index') {
      this.setState({ guides: node.children });
      return node.children;
    }

    if (node.children) {
      node.children.forEach((child, index) => {
        let result = this.findGuideIndex(child);

        if (result !== false) {
          return result;
        }
      });
    }

    return false;
  }

  render() {
    console.log(22, this.state.guides);

    if (this.state.guides.length === 0) {
      return null;
    }

    const allCards = this.state.guides.map((card, index) => {
      return (
        <Card 
          card={ card } 
          key={ index }
          cardId={ index } 
          refDocMapping={ this.props.pageContext.__refDocMapping }
        />
      ) 
    });
    return ( 
      <div className="content">
        <div className="guide-category-list">
          <div className="section" id="guides">
            <div>
              <h1>
                { this.state.name }
                <a className="headerlink" href="#guides" title="Permalink to this headline">¶</a>
              </h1>
              <section className="guide-category">
                <div className="guide-category__title guide-category__title--getting-started">
                  { this.state.description }
                </div>
                <div className="guide-category__guides">
                  { allCards }
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    )
  }

} 
