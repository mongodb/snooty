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

const useStickyTopValues = (eol, includeActionBar = false) => {
  const topLarge = useMemo(
    () => getTopValue(eol, [theme.header.navbarHeight, ...(includeActionBar ? [theme.header.actionBarHeight] : [])]),
    [eol, includeActionBar]
  );

  const actionBarHeight = useMemo(
    () => (includeActionBar ? [theme.header.actionBarMobileHeight] : []),
    [includeActionBar]
  );
  const topMedium = useMemo(
    () => getTopValue(eol, [theme.header.navbarMobileHeight, ...actionBarHeight]),
    [actionBarHeight, eol]
  );
  const topSmall = useMemo(
    () => getTopValue(eol, [theme.header.navbarMobileHeight, theme.header.docsMobileMenuHeight, ...actionBarHeight]),
    [actionBarHeight, eol]
  );

  return { topLarge, topMedium, topSmall };
};

export default useStickyTopValues;
