import React, { Component} from 'react';
import Paragraph from '../components/Paragraph';
import List from '../components/List';
import Include from '../components/Include';
import Stepper from '../components/Stepper';
import { Stitch, AnonymousCredential } from 'mongodb-stitch-browser-sdk';

export default class Section extends Component {

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

  // if JS is enabled, show interactive stepper view
  // otherwise just show list of steps
  componentDidMount() {
    this.setState({
      showAllSteps: false,
      showStepper: true
    });
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
      <div className="section" id={ this.props.sectionData.name }>
        <h2> 
          { this.nameMapping[this.props.sectionData.name] } 
          <a className="headerlink" href={ '#' + this.props.sectionData.name } title="Permalink to this headline">¶</a>
        </h2>
        {
          (this.props.sectionData.name === 'procedure' && this.state.showStepper) ?  
            <Stepper totalStepsInProcedure={ this.state.totalStepsInProcedure } 
                     showStepIndex={ this.state.showStepIndex } 
                     updateVisibleStep={ this.updateVisibleStep.bind(this) } 
                     toggleAllSteps={ this.toggleAllSteps.bind(this) }
                     showAllStepsText={ this.state.showAllStepsText } /> : ''
        }
        {
          this.props.sectionData.children.map((child, index) => {
            if (child.type === 'paragraph') {
              return <Paragraph paragraphData={ child } key={ index } />
            }
            else if (child.type === 'list') {
              return <List listData={ child } key={ index } />
            }
            else if (child.type === 'directive' && child.name === 'include') {
              return <Include includeData={ child } 
                              key={ index } 
                              modal={ this.props.modal }
                              refDocMapping={ this.props.refDocMapping } 
                              showAllSteps={ this.state.showAllSteps } 
                              showStepIndex={ this.state.showStepIndex }
                              updateTotalStepCount={ this.updateTotalStepCount.bind(this) } 
                              addLanguages={ this.props.addLanguages } 
                              activeLanguage={ this.props.activeLanguage } />
            }
          })
        }
      </div>
    )
  }

}

