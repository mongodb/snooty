import React from 'react';
import { useMediaQuery } from 'react-responsive';

const PageSizeContext = React.createContext();
export function PageSizeProvider(props) {
  const isSmallScreen = useMediaQuery({ query: '(max-width: 750px)' });
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  // const isDesktopOrLaptop = useMediaQuery({ query: '(min-device-width: 1224px)' });
  // const isBigScreen = useMediaQuery({ query: '(min-device-width: 1824px)' });
  // const isTabletOrMobileDevice = useMediaQuery({ query: '(max-device-width: 1224px)' });
  // const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
  // const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' });

  const pageSize = React.useMemo(() => {
    return { isTabletOrMobile, isSmallScreen };
  }, [isTabletOrMobile, isSmallScreen]);

  return <PageSizeContext.Provider value={pageSize}>{props.children}</PageSizeContext.Provider>;
}

export default function usePageSize() {
  const pageSize = React.useContext(PageSizeContext);
  if (!pageSize) {
    throw new Error('You must call usePageSize() inside of a PageSizeProvider');
  }
  return pageSize;
}
