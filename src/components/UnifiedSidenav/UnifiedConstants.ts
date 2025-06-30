export interface BreadCrumb {
  path: string;
  title: string;
}
export interface TocItemNested {
  label: string;
  url?: string;
  glyph?: string;
  group?: boolean;
  collapsible?: boolean;
  breadcrumbs?: BreadCrumb[];
  showSubNav?: boolean;
  items?: TocItemNested[];
}

export interface TocItem extends TocItemNested {
  url: string;
  prefix: string;
  l1Id: string;
}

export interface ActiveVersions {
  [project: string]: string;
}
