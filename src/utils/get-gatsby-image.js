import { withPrefix } from 'gatsby';
import { getImageData } from 'gatsby-plugin-image';

function urlBuilder({ baseUrl }) {
  return baseUrl;
}

export const getGatsbyImage = ({ imageUrl, width, height, scale }) => {
  const options = {
    baseUrl: withPrefix(imageUrl),
    urlBuilder,
    formats: ['auto'],
  };

  const imgScale = scale ?? 1;

  // width and image are required
  // but will safely fallback to 16/9 aspect if not
  if (width && height) {
    options.width = width * imgScale;
    options.height = height * imgScale;
  } else {
    options.layout = 'fullWidth';
    options.aspectRatio = 16 / 9;
  }
  return getImageData(options);
};
