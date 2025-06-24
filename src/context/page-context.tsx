import { createContext, useContext } from 'react';
import { Root, TextNode } from '../types/ast';

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

export interface IAOption {
  title: [TextNode];
  slug?: string;
  url?: string;
  id?: string;
  linked_data?: IALinkedData[];
  children?: IAOption[];
}

export interface IALinkedData {
  headline: string;
  url: string;
  icon: string;
  'icon-alt': string;
  'icon-dark'?: string;
  checksum: string;
  width: string;
  height: string;
}

export interface PageContextType {
  page: Root | null;
  template: PageTemplateType | null;
  slug: string;
  tabsMainColumn: boolean | null;
  options: Root['options'] | null;
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
