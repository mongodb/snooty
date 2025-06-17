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
  versionDropdown?: boolean;
  items?: TocItem[];
}

export interface ActiveVersions {
  [project: string]: string;
}

export enum DocSites {
  CLOUD_DOCS = 'cloud-docs',
  DATABASE_TOOLS = 'database-tools',
  CSHARP = 'csharp',
}
