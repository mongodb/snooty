import React, { Component } from 'react';
import ComponentFactory from '../components/ComponentFactory';

export default class Step extends Component {

  render() {
    return (
      <div className="sequence-block" style={
        { display: (this.props.showAllSteps || this.props.showStepIndex === this.props.stepNum) ? 'block' : 'none' }
      }>
        <div className="bullet-block" style={ {display: (this.props.showAllSteps) ? 'block' : 'none'} }>
          <div className="sequence-step">{ this.props.stepNum + 1 }</div>
        </div>
        <div className="section" id="SOMETHING-HERE">
          {
            this.props.nodeData.children.map((child, index) => {
              return <ComponentFactory { ...this.props } nodeData={ child } key={ index } />
            })
          }
        </div>
      </div>
    )
  }

}