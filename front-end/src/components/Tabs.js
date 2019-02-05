import React, { Component } from 'react';
import ComponentFactory from '../components/ComponentFactory';

export default class Tabs extends Component {

  constructor(props) {
    super(props);
    const createdTabset = this.props.addTabset([...this.props.nodeData.children]);
    const tabsetValues = createdTabset.map(element => element[0]);
    // TODO: make this not as lame
    this.tabsetType = 'activeLanguage';
    if (tabsetValues.includes('windows')) {
      this.tabsetType = 'activeOSTab';
    }
  }

  render() {
    console.log('TABS', this.props, this.props.nodeData);
    return (
      this.props.nodeData.children.map((tab, index) => {
        return (
          <div key={ index } style={ 
            { display: ((this.props[this.tabsetType] === undefined || this.props[this.tabsetType][0] === tab.argument[0].value)) ? 'block' : 'none' } 
          }>
            <h3 style={ { color: 'green' } }>{ tab.argument[0].value } Code</h3>
            { 
              tab.children.length > 0 ? 
                <ComponentFactory { ...this.props } nodeData={ tab.children[0] } key={ index } /> :
                ''
            }
          </div>
        )
      })
    )
  }

}