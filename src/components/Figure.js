import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Lightbox from './Lightbox';

const Figure = ({ nodeData }) => {
  const imgRef = React.createRef();
  const [isLightboxSize, setIsLightboxSize] = useState(false);
  const imgSrc = (process.env.GATSBY_PREFIX || '') + nodeData.argument[0].value;

  const imgShouldHaveLightbox = () => {
    const naturalArea = imgRef.current.naturalWidth * imgRef.current.naturalHeight;
    const clientArea = imgRef.current.clientWidth * imgRef.current.clientHeight;
    return clientArea < naturalArea * 0.9;
  };

  const handleImageLoaded = () => {
    setIsLightboxSize(imgShouldHaveLightbox());
  };

  if (isLightboxSize || (nodeData.options && nodeData.options.lightbox)) {
    return <Lightbox nodeData={nodeData} />;
  }

  return (
    <div
      className="figure"
      style={{
        width: nodeData.options && nodeData.options.figwidth ? nodeData.options.figwidth : 'auto',
      }}
    >
      <img
        src={imgSrc}
        alt={nodeData.options.alt ? nodeData.options.alt : nodeData.argument[0].value}
        width="50%"
        onLoad={handleImageLoaded}
        ref={imgRef}
      />
    </div>
  );
};

Figure.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
      })
    ).isRequired,
    options: PropTypes.shape({
      alt: PropTypes.string,
      lightbox: PropTypes.bool,
    }).isRequired,
  }).isRequired,
};

export default Figure;
