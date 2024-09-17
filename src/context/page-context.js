import { createContext, useContext } from 'react';

export const PageContext = createContext({
  page: null,
  template: null,
  slug: null,
  tabsMainColumn: null,
  options: null,
});

export const usePageContext = () => {
  return useContext(PageContext);
};
