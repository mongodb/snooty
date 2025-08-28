export type Versions = {
  id: string;
  gitBranchName: string;
  active: boolean;
  urlAliases: string[];
  publishOriginalBranchName: boolean;
  urlSlug: string;
  versionSelectorLabel: string;
  isStableBranch: boolean;
  buildsWithSnooty: boolean;
  noIndexing: boolean;
  offlineUrl: string;
}[];
