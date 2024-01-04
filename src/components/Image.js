import React from 'react';
import PropTypes from 'prop-types';
import { GatsbyImage } from 'gatsby-plugin-image';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { getNestedValue } from '../utils/get-nested-value';
import { getGatsbyImage } from '../utils/get-gatsby-image';

const Image = ({ nodeData, handleImageLoaded, className, ...props }) => {
  const scale = getNestedValue(['options', 'scale'], nodeData);
  const height = getNestedValue(['options', 'height'], nodeData);
  const width = getNestedValue(['options', 'width'], nodeData);

  const imgSrc = getNestedValue(['argument', 0, 'value'], nodeData);
  const altText = getNestedValue(['options', 'alt'], nodeData) || imgSrc;
  const imgAlignment = getNestedValue(['options', 'align'], nodeData);
  const customAlign = imgAlignment ? `align-${imgAlignment}` : '';

  const hasBorder = getNestedValue(['options', 'border'], nodeData);
  const borderStyling = css`
    border: 0.5px solid ${palette.gray.light1};
    width: 100%;
    border-radius: 4px;
  `;

  const { options: { class: directiveClass } = {} } = nodeData;

  const imageOptions = {
    imageUrl: imgSrc,
  };
  if (width) {
    imageOptions['width'] = width;
  }
  if (height) {
    imageOptions['height'] = height;
  }
  if (scale) {
    imageOptions['scale'] = parseInt(scale, 10) / 100;
  }
  const imageData = getGatsbyImage(imageOptions);

  return (
    <GatsbyImage
      image={imageData}
      alt={altText}
      className={[directiveClass, customAlign, className].join(' ')}
      imgClassName={cx(css`
        ${hasBorder ? borderStyling : ''}
        max-width: 100%;
      `)}
      objectFit={'contain'}
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
