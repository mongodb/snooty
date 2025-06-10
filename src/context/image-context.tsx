/**
 * Context to provide image data to consumer components
 * with image data queried on page component
 */

import React, { createContext, ReactNode } from 'react';
import { getImage } from 'gatsby-plugin-image';
// @ts-ignore
import type { GatsbyImageData } from 'gatsby-plugin-image';

interface ImageContextType {
  imageByPath: { [k: string]: GatsbyImageData | undefined };
}

const ImageContext = createContext<ImageContextType>({
  imageByPath: {},
});

export default ImageContext;

export type ImageContextProviderProps = { images: { relativePath: string }[]; children: ReactNode };

const ImageContextProvider = ({ images, children }: ImageContextProviderProps) => {
  const imageByPath: { [k: string]: GatsbyImageData | undefined } = {};
  for (const image of images) {
    if (image?.relativePath) {
      imageByPath[image.relativePath] = getImage(image);
    } else {
      console.warn(`Image does not have relativePath: ${image}`);
    }
  }
  return <ImageContext.Provider value={{ imageByPath }}>{children} </ImageContext.Provider>;
};

export { ImageContextProvider };
