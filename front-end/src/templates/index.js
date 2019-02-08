import React, { Component } from 'react';
import Card from '../components/Card';
import LandingPageCards from '../components/LandingPageCards';

export default class Index extends Component {

  constructor(propsFromServer) {
    super(propsFromServer);
    this.state = {
      name: 'Guides',
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
    const { guides, name } = this.state;

    if (this.state.guides.length === 0) {
      return null;
    }

    return ( 
      <div className="content">
        <div className="guide-category-list">
          <div className="section" id="guides">
            <h1>
              { name }
              <a className="headerlink" href="#guides" title="Permalink to this headline">¶</a>
            </h1>
            <LandingPageCards
              guides={guides}
              refDocMapping={this.props.pageContext.__refDocMapping}
            />
          </div>
        </div>
      </div>
    )
  }

} 
