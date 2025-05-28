import { PageTemplateType } from '../context/page-context';
import { ParagraphNode, TextNode } from './ast';

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
  groups: Group[] | null;
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

type PageContext = {
  title: string;
  slug: string;
  template: PageTemplateType;
  isAssociatedProduct: boolean;
  repoBranches: {
    siteBasePrefix: string;
    branches: Docset['branches'];
    groups?: Docset['groups'];
  };
  parentPaths: Record<string, string[]>;
  chapters?: MetadataChapters;
  guides?: MetadataGuides;
  // TODO: Need to specify
  associatedReposInfo?: {};
};

type MetadataChapters = Record<string, MetadataChapter>;

type MetadataChapter = {
  id: string;
  chapter_number: number;
  description: string;
  guides: string[];
  icon: string;
};

type MetadataGuides = Record<string, MetadataGuide>;

type MetadataGuide = {
  chapter_name: string;
  completion_time: number;
  description: ParagraphNode;
  title: TextNode;
};

export {
  BranchData,
  Docset,
  EOLType,
  Group,
  MetadataChapters,
  MetadataDatabaseName,
  PageContext,
  ReposDatabaseName,
  SiteMetadata,
  SnootyEnv,
};
