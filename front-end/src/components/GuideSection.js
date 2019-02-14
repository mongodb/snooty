import React, { Component } from 'react';
import ComponentFactory from '../components/ComponentFactory';
import Stepper from '../components/Stepper';

export default class GuideSection extends Component {

  constructor() {
    super();
    this.state = {
      showAllSteps: true,
      showStepper: false,
      showAllStepsText: 'Expand All Steps',
      showStepIndex: 0,
      // TODO: set state based on Daniel's implementation of cloud/local tabs
      templateType: 'local MongoDB',
      totalStepsInProcedure: 1,
      uri: {},
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

  handleUpdateURIWriter(uri) {
    this.setState({
      uri: {
        ...this.state.uri,
        ...uri,
      }
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
                                      handleUpdateURIWriter={ this.handleUpdateURIWriter.bind(this) }
                                      showAllSteps={ this.state.showAllSteps } 
                                      showStepIndex={ this.state.showStepIndex }
                                      templateType={ this.state.templateType }
                                      updateTotalStepCount={ this.updateTotalStepCount.bind(this) }
                                      uri={this.state.uri} />
          })
        }
      </div>
    )
  }

}

