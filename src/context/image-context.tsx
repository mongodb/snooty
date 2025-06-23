/**
 * Context to provide image data to consumer components
 * with image data queried on page component
 */

import React, { createContext, ReactNode } from 'react';
import { getImage } from 'gatsby-plugin-image';
// @ts-ignore
import type { IGatsbyImageData } from 'gatsby-plugin-image';

export interface ImageContextType {
  imageByPath: Record<string, IGatsbyImageData | undefined>;
}

const ImageContext = createContext<ImageContextType>({
  imageByPath: {} as Record<string, IGatsbyImageData | undefined>,
});

export default ImageContext;

export type ImageContextProviderProps = { images: { relativePath: string }[]; children: ReactNode };

const ImageContextProvider = ({ images, children }: ImageContextProviderProps) => {
  const imageByPath = {} as Record<string, IGatsbyImageData | undefined>;
  for (const image of images) {
    if (image?.relativePath) {
      imageByPath[image.relativePath] = getImage(image) ?? undefined;
    } else {
      console.warn(`Image does not have relativePath: ${image}`);
    }
  }
  return <ImageContext.Provider value={{ imageByPath }}>{children} </ImageContext.Provider>;
};

export { ImageContextProvider };
