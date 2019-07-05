import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import Stepper from './Stepper';
import { setLocalValue } from '../utils/browser-storage';
import { SECTION_NAME_MAPPING } from '../constants';

export default class GuideSection extends Component {
  constructor() {
    super();
    this.state = {
      showAllSteps: true,
      showStepper: false,
      showAllStepsText: 'Expand All Steps',
      showStepIndex: 0,
      totalStepsInProcedure: 1,
      uriWriter: {
        cloudURI: {},
        localURI: {},
      },
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
        uriWriter: {
          ...prevState.uri,
          ...uri,
        },
      }),
      () => {
        setLocalValue('uri', this.state.uriWriter); // eslint-disable-line react/destructuring-assignment
      }
    );
  };

  render() {
    const {
      guideSectionData: { children, name },
      headingRef,
    } = this.props;
    const { showAllSteps, showAllStepsText, showStepIndex, showStepper, totalStepsInProcedure, uriWriter } = this.state;
    const section = SECTION_NAME_MAPPING[name];

    return (
      <div className="section">
        <h2 ref={headingRef} style={{ paddingTop: '1.5em', marginTop: '-1.5em' }} id={section.id}>
          {section.title}
          <a className="headerlink" href={`#${section.id}`} title="Permalink to this headline">
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
            uriWriter={uriWriter}
          />
        ))}
      </div>
    );
  }
}

GuideSection.propTypes = {
  headingRef: PropTypes.shape({
    // for server-side rendering, replace Element with an empty function
    current: PropTypes.instanceOf(typeof Element === 'undefined' ? () => {} : Element),
  }).isRequired,
  guideSectionData: PropTypes.shape({
    children: PropTypes.array.isRequired,
    name: PropTypes.oneOf(Object.keys(SECTION_NAME_MAPPING)),
  }).isRequired,
};
