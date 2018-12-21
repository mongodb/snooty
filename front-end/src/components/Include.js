import React, { Component} from 'react';
import ComponentFactory from '../components/ComponentFactory';

export default class Include extends Component {

  constructor(props) {
    super(props);
    let key = this.props.nodeData.argument[0].value;
    if (key.startsWith('/')) key = key.substr(1);
    if (key.endsWith('.rst')) key = key.replace('.rst', '');
    this.resolvedIncludeData = [];
    // get document for include url
    if (this.props.refDocMapping && Object.keys(this.props.refDocMapping).length > 0 ) {
      this.resolvedIncludeData = this.props.refDocMapping[key].ast ? this.props.refDocMapping[key].ast.children : [];
      console.log(99, this.props.refDocMapping[key]);
    } 
    if (this.props.updateTotalStepCount) {
      this.props.updateTotalStepCount(this.resolvedIncludeData.length);
    }
  }

  render() {
    return (
      this.resolvedIncludeData.map((includeObj, index) => {
        return <ComponentFactory { ...this.props } nodeData={ includeObj } key={ index } stepNum={ index } />
      })
    )
  }

}

