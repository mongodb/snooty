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
  versionDropdown?: boolean;
  items?: TocItem[];
}

export interface ActiveVersions {
  [project: string]: string;
}

// DOP-5379: Move this somewhere that makes more sense when toc.ts is more finalized
export enum DocSites {
  CLOUD_DOCS = 'cloud-docs',
  DATABASE_TOOLS = 'database-tools',
  CSHARP = 'csharp',
  ATLAS_CLI = 'atlas-cli',
  CHARTS = 'charts',
  C2C = 'cluster-sync',
}
