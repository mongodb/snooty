/**
 * Service module meant to create requests to
 * Snooty Data API service.
 */

function getBaseUrl(snootyEnv: string) {
  switch (snootyEnv) {
    case 'dotcomprd':
      return 'https://snooty-data-api.mongodb.com/';
    case 'production':
      return 'https://snooty-data-api.mongodb.com/';
    case 'dotcomstg':
      return 'https://snooty-data-api.docs.staging.corp.mongodb.com/';
    default:
      return 'https://snooty-data-api.mongodb.com/';
  }
}

const BASE_URL = getBaseUrl(process.env['SNOOTY_ENV'] ?? '');

type Branch = {
  gitBranchName: string;
  fullUrl: string;
  label: string;
  active: boolean;
  isStableBranch: boolean;
  offlineUrl: string;
};

export type Repo = {
  repoName: string;
  project: string;
  search?: {
    categoryName: string;
    categoryTitle: string;
  };
  branches: Branch[];
  displayName?: string;
};

export const getAllRepos = async () => {
  const url: string = new URL('/projects', BASE_URL).toString();
  try {
    const res = await fetch(url);
    const repos: Repo[] = (await res.json())['data'];
    return repos;
  } catch (e) {
    console.error(`Error while getting all repos: ${e}`);
    throw e;
  }
};
