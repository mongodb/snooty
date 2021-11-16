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
  upToXSmall: 'only screen and (max-width: 320px)',
  xSmallAndUp: 'not all and (max-width: 320px)',
  upToSmall: 'only screen and (max-width: 420px)',
  smallAndUp: 'not all and (max-width: 420px)',
  upToMedium: 'only screen and (max-width: 767px)',
  mediumAndUp: 'not all and (max-width: 767px)',
  upToLarge: 'only screen and (max-width: 1023px)',
  largeAndUp: 'not all and (max-width: 1023px)',
  upToXLarge: 'only screen and (max-width: 1200px)',
  xLargeAndUp: 'not all and (max-width: 1200px)',
  upTo2XLarge: 'only screen and (max-width: 1440px)',
  '2XLargeAndUp': 'not all and (max-width: 1440px)',
  upTo3XLarge: 'only screen and (max-width: 1920px)',
  '3XLargeAndUp': 'not all and (max-width: 1920px)',
  tablet: 'only screen and (min-width: 421px) and (max-width: 1023px)',
};

const header = {
  bannerHeight: '40px',
  navbarHeight: '88px',
  navbarMobileHeight: '56px',
  docsMobileMenuHeight: '52px',
};

const transitionSpeed = {
  iaExit: '100ms',
  iaEnter: '200ms',
  contentFade: '300ms',
};

export const theme = {
  fontSize,
  header,
  screenSize,
  size,
  transitionSpeed,
};
