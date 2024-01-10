import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import ImageContext from '../context/image-context';
import { getNestedValue } from '../utils/get-nested-value';

const Image = ({ nodeData, className }) => {
  const scale = (parseInt(getNestedValue(['options', 'scale'], nodeData), 10) || 100) / 100;
  const widthOption = getNestedValue(['options', 'width'], nodeData);
  let height = getNestedValue(['options', 'height'], nodeData);
  const loading = getNestedValue(['options', 'loading'], nodeData);
  const directiveClass = getNestedValue(['options', 'directiveClass'], nodeData);

  let imgSrc = getNestedValue(['argument', 0, 'value'], nodeData);
  const altText = getNestedValue(['options', 'alt'], nodeData) || imgSrc;
  const imgAlignment = getNestedValue(['options', 'align'], nodeData);
  const customAlign = imgAlignment ? `align-${imgAlignment}` : '';

  const defaultStyling = css`
    max-width: 100%;
    height: auto;
  `;
  const hasBorder = getNestedValue(['options', 'border'], nodeData);
  const borderStyling = css`
    border: 0.5px solid ${palette.gray.light1};
    border-radius: 4px;
  `;

  const { imageByPath } = useContext(ImageContext);
  const image = imageByPath[imgSrc.slice(1)];
  // if there is a preprocessed image, use those new values for
  // src, srcset, width, height
  let srcSet, width;
  if (image) {
    width = image.width * scale;
    height = image.height * scale;
    imgSrc = image.images.fallback.src;
    srcSet = image.images.fallback.srcSet;
  } else {
    width *= scale;
    height *= scale;
    imgSrc = withPrefix(imgSrc);
  }

  const userOptionStyle = {};
  if (widthOption?.endsWith('px')) {
    userOptionStyle['width'] = widthOption;
  }

  if (loading === 'lazy') {
    // loading option comes from parser. if image is to be lazy loaded, use gatsby image
    return (
      <GatsbyImage
        width={width}
        height={height}
        image={image}
        imgClassName={cx(defaultStyling, hasBorder ? borderStyling : '')}
        className={[directiveClass, customAlign, className].join(' ')}
        alt={altText}
        style={userOptionStyle}
      />
    );
  }

  return (
    <img
      src={imgSrc}
      srcSet={srcSet}
      alt={altText}
      height={height}
      width={width}
      style={userOptionStyle}
      className={[cx(defaultStyling, hasBorder ? borderStyling : ''), directiveClass, customAlign, className].join(' ')}
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
