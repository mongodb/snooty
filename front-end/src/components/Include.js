import React, { Component} from 'react';
import ComponentFactory from '../components/ComponentFactory';

export default class Include extends Component {

  constructor(props) {
    super(props);
    let key = this.props.nodeData.argument[0].value;
    if (key.startsWith('/')) key = key.substr(1);
    if (key.includes('.rst')) key = key.replace('.rst', '');
    this.resolvedIncludeData = this.props.refDocMapping[key].ast.children;
    this.props.updateTotalStepCount(this.resolvedIncludeData.length);
    console.log(99, this.props.refDocMapping[key]);
  }

  render() {
    const filename = this.props.nodeData.argument[0].value;
    return (
      this.resolvedIncludeData.map((includeObj, index) => {
        return <ComponentFactory { ...this.props } nodeData={ includeObj } key={ index } stepNum={ index } isInclude={true} filename={filename} />
      })
    )
  }

}

