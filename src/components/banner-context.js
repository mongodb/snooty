import React, { createContext, useState } from 'react';

const BannerContext = createContext({
  bannerContent: null,
  setBannerContent: null,
});

const BannerContextProvider = ({ children }) => {
  const [bannerContent, setBannerContent] = useState(null);
  return <BannerContext.Provider value={{ bannerContent, setBannerContent }}>{children}</BannerContext.Provider>;
};

export { BannerContext, BannerContextProvider };
