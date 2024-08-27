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

const useStickyTopValues = (eol) => {
  const topLarge = useMemo(() => getTopValue(eol, [theme.header.actionBarMobileHeight]), [eol]);

  const topMedium = useMemo(() => getTopValue(eol, [theme.header.actionBarMobileHeight]), [eol]);

  const topSmall = useMemo(() => getTopValue(eol, [theme.header.actionBarMobileHeight]), [eol]);

  return { topLarge, topMedium, topSmall };
};

export default useStickyTopValues;
