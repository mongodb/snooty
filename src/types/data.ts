type EOLType = 'download' | 'link';

type BranchData = {
  gitBranchName: string;
  active: boolean;
  urlSlug: string;
  urlAliases?: string[] | null;
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
  branches: BranchData[];
  hasEolVersions?: boolean;
}

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
  // TODO: Make snootyEnv more specific
  snootyEnv: string;
  user: string;
};

export { BranchData, Docset, EOLType, SiteMetadata, MetadataDatabaseName, ReposDatabaseName };
