export interface BreadCrumb {
  path: string;
  title: string;
}

export interface TocItem {
  label: string;
  glyph?: string;
  url?: string;
  group?: boolean;
  prefix?: string;
  collapsible?: boolean;
  breadcrumbs?: BreadCrumb[];
  showSubNav?: boolean;
  items?: TocItem[];
}
