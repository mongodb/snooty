import React, { Component} from 'react';
import ComponentFactory from '../components/ComponentFactory';

export default class Include extends Component {

  constructor(props) {
    super(props);
    let key = this.props.nodeData.argument[0].value;
    if (key.startsWith('/')) key = key.substr(1);
    if (key.includes('.rst')) key = key.replace('.rst', '');
    this.resolvedIncludeData = [];
    // TODO: use param from parent comp instead
    // server vs. client side data fetching
    if (Object.keys(this.props.refDocMapping).length > 0 ) {
      this.resolvedIncludeData = this.props.refDocMapping[key].ast ? this.props.refDocMapping[key].ast.children : [];
    } else {
      this.props.stitchClient.callFunction('fetchDocuments', ['snooty/documents', { _id: 'guides/andrew/master' + '/' + key }]).then((response) => {
        console.log('data for include', response);
        if (response) {
          this.resolvedIncludeData = response[0].ast.children;
          this.forceUpdate();
        }
      });
    }
    this.props.updateTotalStepCount(this.resolvedIncludeData.length);
    console.log(99, this.props.refDocMapping[key]);
  }

  render() {
    return (
      this.resolvedIncludeData.map((includeObj, index) => {
        return <ComponentFactory { ...this.props } nodeData={ includeObj } key={ index } stepNum={ index } />
      })
    )
  }

}

