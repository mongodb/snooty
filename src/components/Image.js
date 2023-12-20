import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { css } from '@emotion/react';
import { palette } from '@leafygreen-ui/palette';
import { getNestedValue } from '../utils/get-nested-value';

const Image = ({ nodeData, handleImageLoaded, className }) => {
  const [height, setHeight] = useState(null);
  const [width, setWidth] = useState(null);
  const imgRef = useRef();

  const handleLoad = useCallback(() => {
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
  }, [handleImageLoaded, nodeData]);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      handleLoad();
    }
  }, [handleLoad]);

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
    border: 0.5px solid ${palette.gray.light1};
    width: 100%;
    border-radius: 4px;
  `;

  const buildStyles = useCallback(() => {
    return css`
      ${hasBorder ? borderStyling : ''}
      max-width: 100%;
      ${height && { height }}
      ${width && { width }}
    `;
  }, [borderStyling, hasBorder, height, width]);

  const { options: { class: directiveClass } = {} } = nodeData;

  const data = useStaticQuery(graphql`
    query image {
      file(relativePath: { eq: "hero.png" }) {
        id
        relativePath
        childImageSharp {
          gatsbyImageData(placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
        }
      }
    }
  `);

  const image = getImage(data.file);

  return (
    <GatsbyImage
      image={image}
      alt={altText}
      className={[directiveClass, customAlign, className].join(' ')}
      imgStyle={buildStyles()}
      loading="eager"
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
