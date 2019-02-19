import React from 'react';
import PropTypes from 'prop-types';

const Stepper = ({ showAllStepsText, showStepIndex, toggleAllSteps, totalStepsInProcedure, updateVisibleStep }) => (
  <div style={{ marginBottom: '20px', overflow: 'auto' }}>
    {new Array(totalStepsInProcedure).fill(0).map((el, index) => (
      <section
        key={index}
        style={{
          background: showStepIndex === index ? '#13AA52' : '#f1f1f1',
          color: showStepIndex === index ? 'white' : 'black',
          cursor: 'pointer',
          float: 'left',
          width: '20%',
          padding: '8px 0',
          textAlign: 'center',
          border: '1px solid #c5c5c5',
        }}
      >
        <span
          onClick={() => {
            updateVisibleStep(index);
          }}
          role='button'
          tabIndex={0}
        >
          Step
          {index + 1}
        </span>
      </section>
    ))}
    <span
      onClick={() => {
        toggleAllSteps();
      }}
      role='button'
      tabIndex={0}
      style={{
        float: 'right',
        marginTop: '10px',
        color: '#53a1e8',
        fontSize: '14px',
        cursor: 'pointer',
      }}
    >
      {showAllStepsText}
    </span>
  </div>
);

Stepper.propTypes = {
  showAllStepsText: PropTypes.string.isRequired,
  showStepIndex: PropTypes.number.isRequired,
  toggleAllSteps: PropTypes.func.isRequired,
  totalStepsInProcedure: PropTypes.number.isRequired,
  updateVisibleStep: PropTypes.func.isRequired,
};

export default Stepper;
