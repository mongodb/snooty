import { useMemo, useContext } from 'react';
import { HeaderContext } from '../components/Header/header-context';
import { theme } from '../theme/docsTheme';

// Returns the sum of the Header component's children's heights to give the appropriate amount of space for a component
const getTopValue = (bannerEnabled, eol, heights) => {
  let topValue = 0;
  heights.forEach((height) => {
    topValue += theme.size.stripUnit(height);
  });

  const bannerHeight = theme.size.stripUnit(theme.header.bannerHeight);
  if (bannerEnabled) {
    topValue = eol ? bannerHeight : bannerHeight + topValue;
  } else {
    if (eol) {
      topValue = 0;
    }
  }

  return `${topValue}px`;
};

const useStickyTopValues = (eol) => {
  const { bannerContent } = useContext(HeaderContext);
  const bannerEnabled = bannerContent?.isEnabled;
  const topLarge = useMemo(() => getTopValue(bannerEnabled, eol, [theme.header.navbarHeight]), [bannerEnabled, eol]);
  const topMedium = useMemo(() => getTopValue(bannerEnabled, eol, [theme.header.navbarMobileHeight]), [
    bannerEnabled,
    eol,
  ]);
  const topSmall = useMemo(
    () => getTopValue(bannerEnabled, eol, [theme.header.navbarMobileHeight, theme.header.docsMobileMenuHeight]),
    [bannerEnabled, eol]
  );

  return { topLarge, topMedium, topSmall };
};

export default useStickyTopValues;
