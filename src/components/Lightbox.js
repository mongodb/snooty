import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getPathPrefix } from '../utils/get-path-prefix';

const CAPTION_TEXT = 'click to enlarge';
const isSvg = imgSrc => /\.svg$/.test(imgSrc);

const Lightbox = ({ nodeData }) => {
  const [showModal, setShowModal] = useState(false);
  const imgSrc = `${getPathPrefix()}${nodeData.argument[0].value}`;
  const altText = nodeData.options.alt ? nodeData.options.alt : imgSrc;

  const toggleShowModal = () => {
    setShowModal(prevShowState => !prevShowState);
  };

  return (
    <React.Fragment>
      <div
        className="figure lightbox"
        style={{ width: nodeData.options && nodeData.options.figwidth ? nodeData.options.figwidth : 'auto' }}
      >
        <div className="lightbox__imageWrapper" onClick={toggleShowModal} role="button" tabIndex="-1">
          <img src={imgSrc} alt={altText} width="50%" />
          <div className="lightbox__caption">{CAPTION_TEXT}</div>
        </div>
      </div>
      {showModal && (
        <div className="lightbox__modal" title="click to close" onClick={toggleShowModal} role="button" tabIndex="-1">
          <img
            className={[
              'lightbox__content',
              'lightbox__content--activated',
              isSvg(imgSrc) ? 'lightbox__content--scalable' : null,
            ].join(' ')}
            src={imgSrc}
            alt={`${altText} — Enlarged`}
          />
        </div>
      )}
    </React.Fragment>
  );
};

Lightbox.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
      })
    ).isRequired,
    options: PropTypes.shape({
      alt: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default Lightbox;
