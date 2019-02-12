import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import Stepper from './Stepper';

export default class GuideSection extends Component {
  constructor() {
    super();
    this.state = {
      showAllSteps: true,
      showStepper: false,
      showAllStepsText: 'Expand All Steps',
      showStepIndex: 0,
      totalStepsInProcedure: 1,
    };
    this.nameMapping = {
      prerequisites: 'What You’ll Need',
      check_your_environment: 'Check Your Environment',
      procedure: 'Procedure',
      summary: 'Summary',
      whats_next: 'What’s Next',
    };

    this.updateVisibleStep = this.updateVisibleStep.bind(this);
    this.toggleAllSteps = this.toggleAllSteps.bind(this);
    this.updateTotalStepCount = this.updateTotalStepCount.bind(this);
  }

  updateTotalStepCount(total) {
    this.setState({
      totalStepsInProcedure: total,
    });
  }

  updateVisibleStep(newStep) {
    this.setState({
      showStepIndex: newStep,
    });
  }

  toggleAllSteps() {
    const { showAllSteps } = this.state;
    this.setState({
      showAllSteps: !showAllSteps,
      showAllStepsText: showAllSteps ? 'Expand All Steps' : 'Collapse All Steps',
    });
  }

  render() {
    const {
      guideSectionData: { children, name },
    } = this.props;
    const { showAllSteps, showAllStepsText, showStepIndex, showStepper, totalStepsInProcedure } = this.state;

    return (
      <div className="section" id={name}>
        <h2>
          {this.nameMapping[name]}
          <a className="headerlink" href={`#${name}`} title="Permalink to this headline">
            ¶
          </a>
        </h2>
        {name === 'procedure' && showStepper && (
          <Stepper
            totalStepsInProcedure={totalStepsInProcedure}
            showStepIndex={showStepIndex}
            updateVisibleStep={this.updateVisibleStep}
            toggleAllSteps={this.toggleAllSteps}
            showAllStepsText={showAllStepsText}
          />
        )}
        {children.map((child, index) => (
          <ComponentFactory
            {...this.props}
            nodeData={child}
            key={index}
            showAllSteps={showAllSteps}
            showStepIndex={showStepIndex}
            updateTotalStepCount={this.updateTotalStepCount}
          />
        ))}
      </div>
    );
  }
}

GuideSection.propTypes = {
  guideSectionData: PropTypes.shape({
    children: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};
