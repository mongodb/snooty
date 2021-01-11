// Set bannerContent = null when banner should be removed
const bannerContent = null;

/**
 * @type {Object.<string, string>}
 * @property {string} fontsize returns px value
 */
const fontSize = {
  xsmall: '11px',
  tiny: '12px',
  small: '14px',
  default: '16px',
  h1: '36px',
  h2: '24px',
  h3: '18px',
  h4: '16px',
};
/**
 * @type {Object}
 * @property {string} size returns px value
 * @property {function(string): number} stripUnit removes px unit
 */
const size = {
  tiny: '4px',
  small: '8px',
  default: '16px',
  medium: '24px',
  large: '32px',
  xlarge: '64px',
  xxlarge: '128px',
  maxWidth: '1400px',
  /** @type {function(string): number} */
  stripUnit(unit) {
    return parseInt(unit, 10);
  },
};
/**
 * store common responsive sizes
 * @type {Object.<string, string>}
 */
const screenSize = {
  upToXSmall: 'only screen and (max-width: 374px)',
  xSmallAndUp: 'not all and (max-width: 374px)',
  upToSmall: 'only screen and (max-width: 420px)',
  smallAndUp: 'not all and (max-width: 420px)',
  upToMedium: 'only screen and (max-width: 767px)',
  mediumAndUp: 'not all and (max-width: 767px)',
  upToLarge: 'only screen and (max-width: 1023px)',
  largeAndUp: 'not all and (max-width: 1023px)',
  upToXLarge: 'only screen and (max-width: 1200px)',
  xLargeAndUp: 'not all and (max-width: 1200px)',
};

const navbar = {
  bannerHeight: '40px',
  height: bannerContent === null ? '45px' : '85px',
};

export const theme = {
  bannerContent,
  fontSize,
  screenSize,
  size,
  navbar,
};
