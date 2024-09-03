import { createContext, useContext } from 'react';

export const PageContext = createContext({
  page: null,
  template: null,
  slug: null,
});

export const usePageContext = () => {
  return useContext(PageContext);
};
