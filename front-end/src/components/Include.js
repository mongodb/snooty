import React, { Component} from 'react';
import Step from '../components/Step';

export default class Include extends Component {

  constructor(props) {
    super(props);
    let key = this.props.includeData.argument[0].value;
    if (key.startsWith('/')) key = key.substr(1);
    if (key.includes('.rst')) key = key.replace('.rst', '');
    this.resolvedIncludeData = this.props.refDocMapping[key].ast.children;
    this.props.updateTotalStepCount(this.resolvedIncludeData.length);
    console.log(99, this.props.refDocMapping[key]);
  }

  render() {
    return (
      this.resolvedIncludeData.map((includeObj, index) => {
        if (includeObj.name === 'step') {
          return <Step {...this.props} stepData={ includeObj.children[0] } key={ index } stepNum={ index } />
        } 
      })
    )
  }

}

