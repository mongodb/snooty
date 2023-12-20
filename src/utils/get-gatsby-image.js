import { withPrefix } from 'gatsby';
import { getImageData } from 'gatsby-plugin-image';

const DEFAULT_OPTIONS = {
  layout: 'fullWidth',
  aspectRatio: 16 / 9,
};

function urlBuilder({ baseUrl }) {
  return baseUrl;
}

export const getGatsbyImage = ({ imageUrl, ...props }) => {
  return getImageData({
    baseUrl: withPrefix(imageUrl),
    urlBuilder,
    formats: ['auto'],
    ...DEFAULT_OPTIONS,
    ...props,
  });
};
