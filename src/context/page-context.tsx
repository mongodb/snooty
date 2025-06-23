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

export interface Page {
  options: PageOptions | null;
  ast: Root | null;
}

export type PageOptionsKey = keyof PageOptions;

export interface PageOptions {
  template: PageTemplateType;
  has_method_selector?: boolean;
  has_composable_tutorial?: boolean;
  time_required?: number;
  multi_page_tutorial_settings?: {
    show_next_top?: boolean;
  };
  hidefeedback?: string;
  [key: string]: any;
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
