import React, { useContext } from 'react';
import { withPrefix } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import type { IGatsbyImageData } from 'gatsby-plugin-image/dist/src/components/gatsby-image.browser';
import { css, cx } from '@leafygreen-ui/emotion';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { palette } from '@leafygreen-ui/palette';
import ImageContext from '../context/image-context';
import { getNestedValue } from '../utils/get-nested-value';
import { removeLeadingSlash } from '../utils/remove-leading-slash';
import { theme } from '../theme/docsTheme';
import { FigureNode, ImageNode } from '../types/ast';

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

type GetImagePropsProps = {
  userOptionStyle: Record<string, string>;
  width: number;
  height: number;
  hasBorder: boolean;
  darkMode: boolean;
  altText?: string;
  gatsbyImage?: IGatsbyImageData;
  customAlign?: string;
  className?: string;
  directiveClass?: string;
  imgSrc?: string;
  srcSet?: string;
  loading?: string;
};

type GatsbyImageProps = {
  width: number;
  height: number;
  alt: string;
  style: Record<string, string>;
  imgStyle?: Record<string, string>;
  image: IGatsbyImageData;
  className: string;
  src?: string;
  srcSet?: string;
};

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
}: GetImagePropsProps): GatsbyImageProps {
  const imageProps: Partial<GatsbyImageProps> = {
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

  return imageProps as GatsbyImageProps;
}

export type ImageProps = {
  nodeData: ImageNode | FigureNode;
  className?: string;
};

const Image = ({ nodeData, className }: ImageProps) => {
  const scale = (parseInt(getNestedValue(['options', 'scale'], nodeData), 10) || 100) / 100;
  const widthOption: string =
    getNestedValue(['options', 'width'], nodeData) ?? getNestedValue(['options', 'figwidth'], nodeData);
  let height: number = getNestedValue(['options', 'height'], nodeData);
  const loading: string | undefined = getNestedValue(['options', 'loading'], nodeData);
  const directiveClass: string | undefined = getNestedValue(['options', 'class'], nodeData);
  const { darkMode } = useDarkMode();

  let imgSrc: string = getNestedValue(['argument', 0, 'value'], nodeData);
  const altText: string | undefined = getNestedValue(['options', 'alt'], nodeData) || imgSrc;
  const imgAlignment: string | undefined = getNestedValue(['options', 'align'], nodeData);
  const customAlign = imgAlignment ? `align-${imgAlignment}` : '';

  const hasBorder: boolean = !!getNestedValue(['options', 'border'], nodeData);

  const { imageByPath } = useContext(ImageContext);
  const gatsbyImage = imageByPath[removeLeadingSlash(imgSrc)];
  // if there is a preprocessed image, use those new values for
  // src, srcset, width, height
  let srcSet, width;
  if (gatsbyImage) {
    width = gatsbyImage.width * scale;
    height = gatsbyImage.height * scale;
    imgSrc = gatsbyImage.images?.fallback?.src ?? '';
    srcSet = gatsbyImage.images?.fallback?.srcSet ?? '';
  } else {
    width = parseInt(widthOption, 10) * scale;
    height *= scale;
    imgSrc = withPrefix(imgSrc);
  }

  const userOptionStyle: Record<string, string> = {};
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

  return (
    // imageProps contains altText prop
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      {...imageProps}
      // For Croud purposes, we need an integer for height - this is a fallback
      {...(!imageProps.height ? { height: 500, style: { height: 'auto' } } : {})}
    />
  );
};

export default Image;
