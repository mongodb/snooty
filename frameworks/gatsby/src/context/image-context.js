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
