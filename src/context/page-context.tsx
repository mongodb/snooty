import { createContext, useContext } from 'react';
import { Root } from '../types/ast';

interface PageContextType {
  page: Root | null;
  template: string | null;
  slug: string | null;
  tabsMainColumn: boolean | null;
  options: {} | null;
}

export const PageContext = createContext<PageContextType>({
  page: null,
  template: null,
  slug: null,
  tabsMainColumn: null,
  options: null,
});

export const usePageContext = () => {
  return useContext(PageContext);
};
