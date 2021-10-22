import { useMemo, useContext } from 'react';
import { HeaderContext } from '../components/header-context';
import { theme } from '../theme/docsTheme';

// Returns the sum of the Header component's children's heights to give the appropriate amount of space for a component
const getTopValue = (bannerEnabled, heights) => {
  let topValue = 0;
  heights.forEach((height) => {
    topValue += theme.size.stripUnit(height);
  });

  if (bannerEnabled) {
    topValue += theme.size.stripUnit(theme.header.bannerHeight);
  }

  return `${topValue}px`;
};

const useStickyTopValues = () => {
  const { bannerContent } = useContext(HeaderContext);
  const bannerEnabled = bannerContent?.isEnabled;
  const topLarge = useMemo(() => getTopValue(bannerEnabled, [theme.header.navbarHeight]), [bannerEnabled]);
  const topMedium = useMemo(() => getTopValue(bannerEnabled, [theme.header.navbarMobileHeight]), [bannerEnabled]);
  const topSmall = useMemo(
    () => getTopValue(bannerEnabled, [theme.header.navbarMobileHeight, theme.header.docsMobileMenuHeight]),
    [bannerEnabled]
  );

  return { topLarge, topMedium, topSmall };
};

export default useStickyTopValues;
