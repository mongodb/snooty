type EOLType = 'download' | 'link';

type BranchData = {
  gitBranchName: string;
  active: boolean;
  urlSlug: string;
  urlAliases?: Array<string> | null;
  versionSelectorLabel: string;
  offlineUrl: string;
  eol_type?: EOLType;
};

interface Docset {
  prefix: {
    dotcomprd: string;
    dotcomstg: string;
    prd: string;
    stg: string;
  };
  url: {
    dev: string;
    dotcomprd: string;
    dotcomstg: string;
    prd: string;
    stg: string;
    regression: string;
  };
  displayName?: string;
  project: string;
  branches: Array<BranchData>;
  hasEolVersions?: boolean;
  repoName: string;
  search?: { categoryTitle: string; categoryName?: string };
  internalOnly: boolean;
  prodDeployable: boolean;
  groups: Group | null;
  bucket: {
    dev: string;
    dotcomprd: string;
    dotcomstg: string;
    prd: string;
    stg: string;
    regression: string;
  };
}

type Group = {
  id?: string;
  groupLabel: string;
  includedBranches: Array<string>;
};

type MetadataDatabaseName = 'snooty_stage' | 'snooty_prod' | 'snooty_dotcomstg' | 'snooty_dotcomprd' | 'snooty_dev';
type ReposDatabaseName = 'pool' | 'pool_test';

type SiteMetadata = {
  commitHash: string;
  database: MetadataDatabaseName;
  parserBranch: string;
  parserUser: string;
  patchId: string;
  pathPrefix: string;
  project: string;
  reposDatabase: ReposDatabaseName;
  siteUrl: string;
  snootyBranch: string;
  snootyEnv: SnootyEnv;
  user: string;
};

type SnootyEnv = 'dotcomprd' | 'production' | 'dotcomstg' | 'staging' | 'development';

type FacetBase = {
  id: string;
  key: string;
  name: string;
  checked?: boolean;
};

interface FacetOption extends FacetBase {
  type: 'facet-option';
  options: Array<FacetValue>;
}

interface FacetValue extends FacetBase {
  type: 'facet-value';
  facets: Array<FacetOption>;
}

export {
  BranchData,
  Docset,
  EOLType,
  FacetOption,
  FacetValue,
  SiteMetadata,
  MetadataDatabaseName,
  ReposDatabaseName,
  SnootyEnv,
};
