import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const Modal = props => {
  const { modalProperties } = props;
  return (
    <div
      className="__ref-modal"
      style={{
        display: modalProperties.modalVisible ? 'block' : 'none',
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
        left: `${modalProperties.modalPositionLeft}px`,
        top: `${modalProperties.modalPositionTop}px`,
      }}
    >
      <p>{modalProperties.modalContent.text ? modalProperties.modalContent.text : 'Loading...'}</p>
      {modalProperties.modalContent.example && (
        <ComponentFactory
          {...props}
          nodeData={{
            type: 'code',
            value: modalProperties.modalContent.example,
          }}
        />
      )}
    </div>
  );
};

Modal.propTypes = {
  modalProperties: PropTypes.shape({
    modalContent: PropTypes.shape({
      example: PropTypes.string,
      text: PropTypes.string,
    }),
    modalPositionLeft: PropTypes.number,
    modalPositionTop: PropTypes.number,
    modalVisible: PropTypes.bool,
  }).isRequired,
};

export default Modal;
