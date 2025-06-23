import { createContext, useContext } from 'react';
import { Page } from '../types/data';

export type PageTemplateType =
  | 'blank'
  | 'drivers-index'
  | 'document'
  | 'errorpage'
  | 'feature-not-avail'
  | 'instruqt'
  | 'landing'
  | 'openapi'
  | 'changelog'
  | 'search'
  | 'guide'
  | 'product-landing';

export interface PageContextType {
  page: Page | null;
  template: PageTemplateType | null;
  slug: string;
  tabsMainColumn: boolean | null;
  options: Page['options'];
}

export const PageContext = createContext<PageContextType>({
  page: null,
  template: null,
  slug: '',
  tabsMainColumn: null,
  options: null,
});

export const usePageContext = () => {
  return useContext(PageContext);
};
