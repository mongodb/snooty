import React, { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { theme } from '../../theme/docsTheme';
import { SiteBannerContent } from '../Banner/SiteBanner/types';

interface HeaderContextType {
  bannerContent: SiteBannerContent | null;
  setBannerContent: Function;
  totalHeaderHeight: string;
}

const HeaderContext = createContext<HeaderContextType>({
  bannerContent: null,
  setBannerContent: () => {},
  totalHeaderHeight: theme.header.navbarHeight,
});

const HeaderContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [bannerContent, setBannerContent] = useState(null);
  const [totalHeaderHeight, setTotalHeaderHeight] = useState(theme.header.navbarHeight);

  useEffect(() => {
    const totalHeight = `calc(
      ${bannerContent != null ? `${theme.header.bannerHeight} +` : ''}
      ${theme.header.navbarHeight}
    )`;
    setTotalHeaderHeight(totalHeight);
  }, [bannerContent, setTotalHeaderHeight]);

  return (
    <HeaderContext.Provider value={{ bannerContent, setBannerContent, totalHeaderHeight }}>
      {children}
    </HeaderContext.Provider>
  );
};

export { HeaderContext, HeaderContextProvider };
