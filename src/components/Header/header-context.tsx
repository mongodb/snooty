import React, { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { theme } from '../../theme/docsTheme';
import { useBanner } from '../../hooks/useBanner';

interface HeaderContextType {
  totalHeaderHeight: string;
  hasBanner: boolean;
}

const HeaderContext = createContext<HeaderContextType>({
  totalHeaderHeight: theme.header.navbarHeight,
  hasBanner: false,
});

const HeaderContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const bannerContent = useBanner();
  const hasBanner = bannerContent && bannerContent.url && (bannerContent.imgPath || bannerContent.text) ? true : false;
  const [totalHeaderHeight, setTotalHeaderHeight] = useState(theme.header.navbarHeight);

  useEffect(() => {
    const totalHeight = `calc(
      ${hasBanner != null ? `${theme.header.bannerHeight} +` : ''}
      ${theme.header.navbarHeight}
    )`;
    setTotalHeaderHeight(totalHeight);
  }, [setTotalHeaderHeight, hasBanner]);

  return <HeaderContext.Provider value={{ hasBanner, totalHeaderHeight }}>{children}</HeaderContext.Provider>;
};

export { HeaderContext, HeaderContextProvider };
