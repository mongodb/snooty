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
    const line = this.props.guideSectionData.position.start.line;
    const file = 'cloud/atlas.rst'; // TODO: get filename properly
    const headingIsActive = (this.props.activePosition === line && this.props.activeFile === file)
      ? 'highlight' : '';
    const headingHasComment = this.props.lineHasComment(line, file) ? 'highlight-light' : '';
    return (
      <div className="section" id={ this.props.guideSectionData.name }>
        <h2
          className={`${headingHasComment} ${headingIsActive}`}
          onClick={(event) => this.props.handleClick(event, this.props.guideSectionData.position.start.line, file)}
        >
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
            const hasComment = this.props.linesWithComments.includes(child.position.start.line);
            return <ComponentFactory { ...this.props } 
                                      nodeData={ child } 
                                      key={ index } 
                                      showAllSteps={ this.state.showAllSteps } 
                                      showStepIndex={ this.state.showStepIndex }
                                      updateTotalStepCount={ this.updateTotalStepCount.bind(this) }
                                      activePosition={this.props.activePosition}
                                      linesWithComments={this.props.linesWithComments} />
          })
        }
        {
          (this.props.guideSectionData.name === 'summary') ? <URIForm /> : '' 
        }
      </div>
    )
  }

}

