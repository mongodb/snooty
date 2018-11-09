import React, { Component } from 'react';

export default class Stepper extends Component {

  render() {
    return (
      <div style={ {marginBottom: '20px', overflow: 'auto'} }>
        { 
          new Array(this.props.totalStepsInProcedure).fill(0).map((el, index) => {
            return (
              <section 
                key={ index }
                onClick={ () => { this.props.updateVisibleStep(index) } } 
                style={ 
                  {
                    background: (this.props.showStepIndex === index) ? '#13AA52' : '#f1f1f1',
                    color: (this.props.showStepIndex === index) ? 'white' : 'black',
                    cursor: 'pointer', 
                    float: 'left', 
                    width: '20%', 
                    padding: '8px 0', 
                    textAlign: 'center',
                    border: '1px solid #c5c5c5'
                  } 
                }>
                <span>Step { index + 1 }</span>
              </section>
            )
          }) 
        }
        <span onClick={ () => { this.props.toggleAllSteps() } } 
          style={ {float: 'right', marginTop: '10px', color: '#53a1e8', fontSize: '14px', cursor: 'pointer'} }>
          { this.props.showAllStepsText }
        </span>
      </div>
    )
  }

}