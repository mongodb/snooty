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

interface PageOptions {
  has_composable_tutorial?: boolean;
  time_required?: number;
  multi_page_tutorial_settings?: {
    show_next_top?: boolean;
  };
}

interface PageContextType {
  page: Root | null;
  template: PageTemplateType | null;
  slug: string;
  tabsMainColumn: boolean | null;
  options: PageOptions | null;
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
