export interface BreadCrumb {
  path: string;
  title: string;
}

export interface TocItem {
  label: string;
  url?: string;
  group?: boolean;
  contentSite: string;
  collapsible?: boolean;
  breadcrumbs?: BreadCrumb[];
  showSubNav?: boolean;
  isExternal?: boolean;
  versionDropdown?: boolean;
  items?: TocItem[];
}

export interface ActiveVersions {
  [project: string]: string;
}
