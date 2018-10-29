import React, { Component} from 'react';
import CodeBlock from '../components/CodeBlock';

export default class Modal extends Component {

  render() {
    return (
      <div className="__ref-modal" style={
        {
          display: (this.props.modalProperties.modalVisible) ? 'block': 'none',
          position: 'absolute',
          overflow: 'auto',
          width: '500px',
          height: '300px',
          padding: '0 18px',
          fontSize: '14px',
          border: '1px solid rgb(194, 211, 226)',
          background: 'rgb(247, 251, 255)',
          borderRadius: '3px',
          boxShadow: '#a7a7a7 0px 1px 2px',
          left: this.props.modalProperties.modalPositionLeft + 'px',
          top: this.props.modalProperties.modalPositionTop + 'px'
        }
      }>
        <p>
          {
            (this.props.modalProperties.modalContent.text) ?
              this.props.modalProperties.modalContent.text :
              'Loading...'
          }
        </p>
        {
          (this.props.modalProperties.modalContent.example) ? 
            <CodeBlock codeData={ { value: this.props.modalProperties.modalContent.example } } /> :
            ''
        }
      </div>
    )
  }

}