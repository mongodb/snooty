import { useMemo } from 'react';
import { theme } from '../theme/docsTheme';

// Returns the sum of the Header component's children's heights to give the appropriate amount of space for a component
const getTopValue = (eol: boolean, heights: string[]) => {
  let topValue = 0;
  heights.forEach((height) => {
    topValue += theme.size.stripUnit(height);
  });
  if (eol) {
    topValue = 0;
  }

  return `${topValue}px`;
};

type StickyTopValues = {
  topLarge: string;
  topMedium: string;
  topSmall: string;
};

/**
 *  Get string values (px units) of buffers needed for sticky elements
 *
 * @param {boolean}     eol           if product is eol, meaning no nav bar
 * @param {boolean}     isAbsolute    if element will be absolute positioned and
 *                                    needs to consider universal navbar height
 * @param {boolean}     hasBanner     if there is a banner, absolute elements need to
 *                                    clear
 */
const useStickyTopValues = (eol = false, isAbsolute?: boolean, hasBanner?: boolean): StickyTopValues => {
  const topLarge = useMemo(
    () =>
      getTopValue(eol, [
        theme.header.actionBarMobileHeight,
        ...(isAbsolute ? [theme.header.navbarHeight] : []),
        ...(hasBanner ? [theme.header.bannerHeight] : []),
      ]),
    [eol, isAbsolute, hasBanner]
  );

  const topMedium = useMemo(
    () =>
      getTopValue(eol, [
        theme.header.actionBarMobileHeight,
        ...(isAbsolute ? [theme.header.navbarMobileHeight] : []),
        ...(hasBanner ? [theme.header.bannerHeight] : []),
      ]),
    [eol, hasBanner, isAbsolute]
  );

  const topSmall = useMemo(
    () =>
      getTopValue(eol, [
        theme.header.actionBarMobileHeight,
        ...(isAbsolute ? [theme.header.navbarMobileHeight] : []),
        ...(hasBanner ? [theme.header.bannerHeight] : []),
      ]),
    [eol, isAbsolute, hasBanner]
  );

  return { topLarge, topMedium, topSmall };
};

export default useStickyTopValues;
