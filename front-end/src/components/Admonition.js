import React, { Component} from 'react';
import Paragraph from '../components/Paragraph';

export default class Admonition extends Component {

  // backwards compatible css clasnames
  admonitionRendering() {
    if (this.props.admonitionData.name === 'admonition') {
      return (
        <div className={ `admonition admonition-${this.props.admonitionData.argument[0].value.toLowerCase().replace(/\s/g, '-')}` }>
          <p className="first admonition-title">{ this.props.admonitionData.argument[0].value }</p>
          <section>
            <Paragraph paragraphData={ this.props.admonitionData.children[0] } admonition={ true } modal={ this.props.modal } />
          </section>
        </div>
      )
    } else {
      return (
        <div className={ (this.props.admonitionData.name === 'tip') ? `admonition admonition-tip` : `admonition ${this.props.admonitionData.name}` }>
          <p className="first admonition-title">{ this.props.admonitionData.name }</p>
          <section>
            <Paragraph 
              modal={ this.props.modal }
              admonition={ true }
              paragraphData={ 
                { 
                  children: this.props.admonitionData.children.length > 0 ? 
                            [...this.props.admonitionData.children[0].children, ...this.props.admonitionData.argument] : 
                            this.props.admonitionData.argument 
                } 
              } />
          </section>
        </div>
      )
    }
  }

  render() {
    return (
      this.admonitionRendering()
    )
  }

}