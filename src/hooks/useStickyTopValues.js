import { useMemo } from 'react';
import { theme } from '../theme/docsTheme';

// Returns the sum of the Header component's children's heights to give the appropriate amount of space for a component
const getTopValue = (eol, heights) => {
  let topValue = 0;
  heights.forEach((height) => {
    topValue += theme.size.stripUnit(height);
  });
  if (eol) {
    topValue = 0;
  }

  return `${topValue}px`;
};

/**
 *  Get string values (px units) of buffers needed for sticky elements
 *
 * @param {boolean}     eol           if product is eol, meaning no nav bar
 * @param {boolean}     isAbsolute    if element will be absolute positioned and
 *                                    needs to consider universal navbar height
 * @returns {[key: string]: string}
 */
const useStickyTopValues = (eol, isAbsolute) => {
  const topLarge = useMemo(
    () => getTopValue(eol, [theme.header.actionBarMobileHeight].concat(isAbsolute ? [theme.header.navbarHeight] : [])),
    [eol, isAbsolute]
  );

  const topMedium = useMemo(
    () => getTopValue(eol, [theme.header.actionBarMobileHeight].concat(isAbsolute ? [theme.header.navbarHeight] : [])),
    [eol, isAbsolute]
  );

  const topSmall = useMemo(
    () =>
      getTopValue(
        eol,
        [theme.header.actionBarMobileHeight].concat(isAbsolute ? [theme.header.navbarMobileHeight] : [])
      ),
    [eol, isAbsolute]
  );

  return { topLarge, topMedium, topSmall };
};

export default useStickyTopValues;
