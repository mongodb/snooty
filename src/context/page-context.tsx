import { createContext, useContext } from 'react';
import { Root } from '../types/ast';

export type PageTemplateType =
  | 'blank'
  | 'drivers-index'
  | 'errorpage'
  | 'feature-not-avail'
  | 'instruqt'
  | 'landing'
  | 'openapi'
  | 'changelog'
  | 'search'
  | 'guide'
  | 'product-landing';

// TODO: Check this
export interface Page {
  options: PageOptions | null;
  ast: Root | null;
}

export interface PageOptions {
  template: PageTemplateType;
  has_composable_tutorial?: boolean;
  has_method_selector?: boolean;
}

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
