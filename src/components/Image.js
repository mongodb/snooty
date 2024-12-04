import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import { css, cx } from '@leafygreen-ui/emotion';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { palette } from '@leafygreen-ui/palette';
import ImageContext from '../context/image-context';
import { getNestedValue } from '../utils/get-nested-value';
import { removeLeadingSlash } from '../utils/remove-leading-slash';
import { theme } from '../theme/docsTheme';

const defaultImageStyling = css`
  max-width: 100%;
  height: auto;
`;

const borderStyling = css`
  border-radius: ${theme.size.default};
  border: 0.5px solid var(--border-color);
`;

const borderContainerStyling = css`
  > img {
    ${borderStyling}
  }
`;

const gatsbyContainerStyle = css`
  height: max-content;
  overflow: hidden;
  > img {
    ${defaultImageStyling}
  }
`;

function getImageProps({
  altText,
  userOptionStyle,
  width,
  height,
  gatsbyImage,
  hasBorder,
  darkMode,
  customAlign,
  className,
  directiveClass,
  imgSrc,
  srcSet,
  loading,
}) {
  const imageProps = {
    alt: altText ?? '',
    style: userOptionStyle,
  };
  if (width) {
    imageProps['width'] = width;
  }
  if (height) {
    imageProps['height'] = height;
  }

  const borderColor = darkMode && hasBorder ? palette.gray.dark2 : darkMode ? 'transparent' : palette.gray.light1;

  if (gatsbyImage && loading === 'lazy') {
    imageProps['image'] = gatsbyImage;
    imageProps['className'] = cx(
      gatsbyContainerStyle,
      directiveClass,
      customAlign,
      className,
      hasBorder ? borderContainerStyling : ''
    );
    imageProps['imgStyle'] = {
      '--border-color': borderColor,
    };
  } else {
    imageProps['src'] = imgSrc;
    imageProps['srcSet'] = srcSet;
    imageProps['className'] = cx(
      defaultImageStyling,
      hasBorder ? borderStyling : '',
      directiveClass,
      customAlign,
      className
    );
    imageProps['style'] = {
      '--border-color': borderColor,
    };
  }

  return imageProps;
}

const Image = ({ nodeData, className }) => {
  const scale = (parseInt(getNestedValue(['options', 'scale'], nodeData), 10) || 100) / 100;
  const widthOption = getNestedValue(['options', 'width'], nodeData);
  let height = getNestedValue(['options', 'height'], nodeData);
  const loading = getNestedValue(['options', 'loading'], nodeData);
  const directiveClass = getNestedValue(['options', 'class'], nodeData);
  const { darkMode } = useDarkMode();

  let imgSrc = getNestedValue(['argument', 0, 'value'], nodeData);
  const altText = getNestedValue(['options', 'alt'], nodeData) || imgSrc;
  const imgAlignment = getNestedValue(['options', 'align'], nodeData);
  const customAlign = imgAlignment ? `align-${imgAlignment}` : '';

  const hasBorder = getNestedValue(['options', 'border'], nodeData);

  const { imageByPath } = useContext(ImageContext);
  const gatsbyImage = imageByPath[removeLeadingSlash(imgSrc)];
  // if there is a preprocessed image, use those new values for
  // src, srcset, width, height
  let srcSet, width;
  if (gatsbyImage) {
    width = gatsbyImage.width * scale;
    height = gatsbyImage.height * scale;
    imgSrc = gatsbyImage.images.fallback.src;
    srcSet = gatsbyImage.images.fallback.srcSet;
  } else {
    width = parseInt(widthOption, 10) * scale;
    height *= scale;
    imgSrc = withPrefix(imgSrc);
  }

  const userOptionStyle = {};
  if (widthOption?.endsWith('px')) {
    userOptionStyle['width'] = widthOption;
  }

  const imageProps = getImageProps({
    altText,
    userOptionStyle,
    width,
    height,
    gatsbyImage,
    hasBorder,
    darkMode,
    customAlign,
    className,
    directiveClass,
    imgSrc,
    srcSet,
    loading,
  });

  if (loading === 'lazy' && gatsbyImage) {
    return <GatsbyImage {...imageProps} />;
  }

  // imageProps contains altText prop
  // eslint-disable-next-line jsx-a11y/alt-text
  return <img {...imageProps} />;
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
