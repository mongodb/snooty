import React, { Component} from 'react';
import LiteralInclude from '../components/LiteralInclude';

export default class Tabs extends Component {

  constructor(props) {
    super(props);
    this.props.addLanguages([...this.props.tabsData.children]);
  }

  render() {
    return (
      this.props.tabsData.children.map((tab, index) => {
        return (
          // TODO: LOOP THROUGH CHILDREN HERE
          <div key={ index} style={ { display: (this.props.activeLanguage === undefined || (this.props.activeLanguage[0] === tab.argument[0].value)) ? 'block' : 'none' } }>
            <h3 style={ { color: 'green' } }>{ tab.argument[0].value } Code</h3>
            <LiteralInclude literalIncludeData={ tab.children[0] } refDocMapping={ this.props.refDocMapping } key={ index } />
          </div>
        )
      })
    )
  }

}