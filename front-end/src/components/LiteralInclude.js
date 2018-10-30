import React, { Component} from 'react';
import CodeBlock from '../components/CodeBlock';

export default class LiteralInclude extends Component {

  constructor(props) {
    super(props);
    let key = this.props.literalIncludeData.argument[0].children[0].value;
    let startText = this.props.literalIncludeData.options['start-after'];
    let endText = this.props.literalIncludeData.options['end-before'];
    this.resolvedIncludeData = this.props.refDocMapping[key];
    console.log('LIT', this.props.literalIncludeData);
    // extract code example
    this.codeExample = this.resolvedIncludeData.substring(this.resolvedIncludeData.indexOf(startText) + startText.length, this.resolvedIncludeData.indexOf(endText));
  }

  render() {
    return <CodeBlock codeData={ { value: this.codeExample.substring(0, this.codeExample.lastIndexOf('\n')).trim() } } />
  }

}