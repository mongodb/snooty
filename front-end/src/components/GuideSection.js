import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import Stepper from './Stepper';
import { setLocalValue } from '../localStorage';

export default class GuideSection extends Component {
  constructor() {
    super();
    this.state = {
      showAllSteps: true,
      showStepper: false,
      showAllStepsText: 'Expand All Steps',
      showStepIndex: 0,
      totalStepsInProcedure: 1,
      uri: {},
    };

    this.nameMapping = {
      prerequisites: 'What You’ll Need',
      check_your_environment: 'Check Your Environment',
      procedure: 'Procedure',
      summary: 'Summary',
      whats_next: 'What’s Next',
      seealso: 'See Also',
    };
  }

  updateTotalStepCount = total => {
    this.setState({
      totalStepsInProcedure: total,
    });
  };

  updateVisibleStep = newStep => {
    this.setState({
      showStepIndex: newStep,
    });
  };

  toggleAllSteps = () => {
    const { showAllSteps } = this.state;
    this.setState({
      showAllSteps: !showAllSteps,
      showAllStepsText: showAllSteps ? 'Expand All Steps' : 'Collapse All Steps',
    });
  };

  handleUpdateURIWriter = uri => {
    this.setState(
      prevState => ({
        uri: {
          ...prevState.uri,
          ...uri,
        },
      }),
      () => setLocalValue('uri', this.state.uri) // eslint-disable-line react/destructuring-assignment
    );
  };

  render() {
    const {
      guideSectionData: { children, name },
    } = this.props;
    const { showAllSteps, showAllStepsText, showStepIndex, showStepper, totalStepsInProcedure, uri } = this.state;

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
            handleUpdateURIWriter={this.handleUpdateURIWriter}
            key={index}
            nodeData={child}
            showAllSteps={showAllSteps}
            showStepIndex={showStepIndex}
            updateTotalStepCount={this.updateTotalStepCount}
            uri={uri}
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
