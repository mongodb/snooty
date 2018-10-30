import React, { Component} from 'react';
import Card from '../components/Card';

export default class Main extends Component {

  constructor(propsFromServer) {
    super(propsFromServer);
    this.state = {
      name: 'Guides',
      description: 'Getting Started',
      guides: this.props.pageContext.__refDocMapping.index.ast.children[1].children[2].children,
      languagesFilter: [],
      operatingSystemsFilter: [],
      platformsFilter: []
    };
  }

  render() {
    const allCards = this.state.guides.map((card, index) => {
      return (
        <Card 
          card={ card } 
          key={ index }
          cardId={ index } 
        />
      ) 
    });
    const filterBy = (key) => {
      const keyName = key + 'Filter';
      const allValues = this.state[keyName].map((filter, index) => {
        return <option value={ filter } key={ index }>{ filter }</option> 
      });
      return (
        <select style={{marginLeft:"3px"}}>
          <option value="all" defaultValue>All { key }</option> 
          { allValues }
        </select>
      )
    }
    return ( 
      <div className="content">
        <div className="guide-category-list">
          <div className="section" id="guides">
            <div>
              <h1>
                { this.state.name }
                <a className="headerlink" href="#guides" title="Permalink to this headline">¶</a>
              </h1>
              <aside style={{width: "1010px", borderRadius: "5px", background: "#24282b", padding: "1px 18px", marginBottom: "15px", overflow: "auto"}} >
                <h3 style={{color: "white", float: "left", paddingTop: "6px", marginRight: "12px"}}>Filter By: </h3>
                <p style={{float: "left", marginRight: "12px"}}> { filterBy('languages') } </p>
                <p style={{float: "left", marginRight: "12px"}}> { filterBy('operatingSystems') } </p>
                <p style={{float: "left", marginRight: "12px"}}> { filterBy('platforms') } </p>
              </aside>
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
