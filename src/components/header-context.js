import React, { createContext, useEffect, useState } from 'react';
import { theme } from '../theme/docsTheme';

const HeaderContext = createContext({
  bannerContent: null,
  setBannerContent: () => {},
  totalHeaderHeight: theme.header.navbarHeight,
});

const HeaderContextProvider = ({ children }) => {
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
