import React, { Component} from 'react';
import Role from '../components/Role';

export default class Paragraph extends Component {

  paragraphRendering() {
    return (
      this.props.paragraphData.children.map((element, index) => {
        // plain text 
        if (element.type === 'text') {
          return element.value
        }
        // different roles
        else if (element.type === 'role') {
          return <Role roleData={ element } key={ index } modal={ this.props.modal } />
        } 
        // literal
        else if (element.type === 'literal') {
          return (
            <code className="docutils literal notranslate" key={ index }>
              <span className="pre">{ element.children[0].value }</span>
            </code>
          ) 
        } 
      })
    )
  }

  render() {
    return (
      <p>
        { this.paragraphRendering() }
      </p>
    )
  }

}