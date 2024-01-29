/**
 * Context to provide image data to consumer components
 * with image data queried on page component
 */

import { createContext } from 'react';
import { getImage } from 'gatsby-plugin-image';

const ImageContext = createContext({
  imageByPath: {},
});

export default ImageContext;

const ImageContextProvider = ({ images, children }) => {
  const imageByPath = {};
  console.log('IMAGES in Context ', images);
  for (const image of images) {
    if (image?.relativePath) {
      console.log('image rel Path ', image.relativePath);
      imageByPath[image.relativePath] = getImage(image);
    }
  }
  return <ImageContext.Provider value={{ imageByPath }}>{children} </ImageContext.Provider>;
};

export { ImageContextProvider };
