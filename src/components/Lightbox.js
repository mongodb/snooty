import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import { getNestedValue } from '../utils/get-nested-value';

const CAPTION_TEXT = 'click to enlarge';
const isSvg = imgSrc => /\.svg$/.test(imgSrc);

const Lightbox = ({ nodeData, base64Src }) => {
  const [showModal, setShowModal] = useState(false);
  const imgSrc = getNestedValue(['argument', 0, 'value'], nodeData);
  const altText = getNestedValue(['options', 'alt'], nodeData) || imgSrc;
  const modal = useRef(null);
  const imgData = !process.env.PREVIEW_PAGE ? withPrefix(imgSrc) : base64Src;

  const toggleShowModal = () => {
    setShowModal(prevShowState => !prevShowState);
  };

  const handleOnKeyDown = e => {
    // Escape key
    if (e.keyCode === 27) {
      toggleShowModal();
    }
  };

  // Hook to take effect with every re-render
  useEffect(() => {
    if (modal.current) {
      modal.current.focus();
    }
  });

  return (
    <React.Fragment>
      <div className="figure lightbox" style={{ width: getNestedValue(['options', 'figwidth'], nodeData) || 'auto' }}>
        <div className="lightbox__imageWrapper" onClick={toggleShowModal} role="button" tabIndex="-1">
          <img src={imgData} alt={altText} width="50%" />
          <div className="lightbox__caption">{CAPTION_TEXT}</div>
        </div>
      </div>
      {showModal && (
        <div
          className="lightbox__modal"
          title="click to close"
          onClick={toggleShowModal}
          ref={modal}
          onKeyDown={handleOnKeyDown}
          role="button"
          tabIndex="-1"
        >
          <img
            className={[
              'lightbox__content',
              'lightbox__content--activated',
              isSvg(imgSrc) ? 'lightbox__content--scalable' : null,
            ].join(' ')}
            src={imgData}
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
  base64Src: PropTypes.string,
};

Lightbox.defaultProps = {
  base64Src: null,
};

export default Lightbox;
