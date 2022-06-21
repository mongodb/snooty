import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import { css } from '@emotion/react';
import { getNestedValue } from '../utils/get-nested-value';
import { uiColors } from '@leafygreen-ui/palette';

const Image = ({ nodeData, handleImageLoaded, className }) => {
  const [height, setHeight] = useState(null);
  const [width, setWidth] = useState(null);
  const imgRef = useRef();

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      handleLoad();
    }
  });

  const handleLoad = () => {
    const img = imgRef.current;
    handleImageLoaded(img);

    const scale = getNestedValue(['options', 'scale'], nodeData);
    if (scale) {
      scaleSize(img.naturalWidth, img.naturalHeight, scale);
    } else {
      const height = getNestedValue(['options', 'height'], nodeData);
      const width = getNestedValue(['options', 'width'], nodeData);
      if (height) setHeight(height);
      if (width) setWidth(height);
    }
  };

  const scaleSize = (width, height, scale) => {
    const scaleValue = parseInt(scale, 10) / 100.0;
    setHeight(height * scaleValue);
    setWidth(width * scaleValue);
  };

  const imgSrc = getNestedValue(['argument', 0, 'value'], nodeData);
  const altText = getNestedValue(['options', 'alt'], nodeData) || imgSrc;
  const imgAlignment = getNestedValue(['options', 'align'], nodeData);
  const customAlign = imgAlignment ? `align-${imgAlignment}` : '';

  const hasBorder = getNestedValue(['options', 'border'], nodeData);
  const borderStyling = css`
    border: 0.5px solid ${uiColors.gray.light1};
    width: 100%;
    border-radius: 4px;
  `;

  const buildStyles = () => {
    return {
      ...(height && { height }),
      ...(width && { width }),
    };
  };

  const { options: { class: directiveClass } = {} } = nodeData;

  return (
    <img
      src={withPrefix(imgSrc)}
      alt={altText}
      className={[directiveClass, customAlign, className].join(' ')}
      style={nodeData.options ? buildStyles() : {}}
      onLoad={handleLoad}
      ref={imgRef}
      css={css`
        ${hasBorder ? borderStyling : ''}
        max-width: 100%;
      `}
    />
  );
};

Image.propTypes = {
  className: PropTypes.string,
  handleImageLoaded: PropTypes.func,
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
      })
    ),
    options: PropTypes.shape({
      align: PropTypes.string,
      alt: PropTypes.string,
      checksum: PropTypes.string,
      height: PropTypes.string,
      scale: PropTypes.string,
      width: PropTypes.string,
    }),
  }).isRequired,
};

Image.defaultProps = {
  className: '',
  handleImageLoaded: () => {},
};

export default Image;
