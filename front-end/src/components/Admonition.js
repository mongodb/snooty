import React, { Component} from 'react';
import Paragraph from '../components/Paragraph';

export default class Admonition extends Component {

  render() {
    return (
      <div className={ "admonition " + this.props.admonitionData.name }>
        <p className="first admonition-title">{ this.props.admonitionData.argument[0].value }</p>
        <section>
          <Paragraph paragraphData={ this.props.admonitionData.children[0] } modal={ this.props.modal } />
        </section>
      </div>
    )
  }

}