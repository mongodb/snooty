import React, { Component } from 'react';
import ComponentFactory from '../components/ComponentFactory';
import Stepper from '../components/Stepper';
import URIForm from '../components/URIForm';

export default class GuideSection extends Component {

  constructor() {
    super();
    this.state = {
      showAllSteps: true,
      showStepper: false,
      showAllStepsText: 'Expand All Steps',
      showStepIndex: 0,
      totalStepsInProcedure: 1
    };  
    this.nameMapping = {
      'prerequisites': 'What You’ll Need',
      'check_your_environment': 'Check Your Environment',
      'procedure': 'Procedure',
      'summary': 'Summary',
      'whats_next': 'What’s Next'
    };
  }

  updateTotalStepCount(total) {
    this.setState({
      totalStepsInProcedure: total
    });
  }

  updateVisibleStep(newStep) {
    this.setState({
      showStepIndex: newStep
    });
  }

  toggleAllSteps() {
    this.setState({
      showAllSteps: !this.state.showAllSteps,
      showAllStepsText: this.state.showAllSteps ? 'Expand All Steps' : 'Collapse All Steps'
    });
  }

  render() {
    return (
      <div className="section" id={ this.props.guideSectionData.name }>
        <h2> 
          { this.nameMapping[this.props.guideSectionData.name] } 
          <a className="headerlink" href={ '#' + this.props.guideSectionData.name } title="Permalink to this headline">¶</a>
        </h2>
        {
          (this.props.guideSectionData.name === 'procedure' && this.state.showStepper) ?  
            <Stepper totalStepsInProcedure={ this.state.totalStepsInProcedure } 
                     showStepIndex={ this.state.showStepIndex } 
                     updateVisibleStep={ this.updateVisibleStep.bind(this) } 
                     toggleAllSteps={ this.toggleAllSteps.bind(this) }
                     showAllStepsText={ this.state.showAllStepsText } /> : ''
        }
        {
          this.props.guideSectionData.children.map((child, index) => {
            return <ComponentFactory { ...this.props } 
                                      nodeData={ child } 
                                      key={ index } 
                                      showAllSteps={ this.state.showAllSteps } 
                                      showStepIndex={ this.state.showStepIndex }
                                      updateTotalStepCount={ this.updateTotalStepCount.bind(this) } />
          })
        }
      </div>
    )
  }

}

