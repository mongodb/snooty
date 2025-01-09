import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
// import { useAllDocsets } from '../../hooks/useAllDocsets';
import { getAllRepos, type Repo } from '../../utils/snooty-data-api';
import assertLeadingBrand from '../../utils/assert-leading-brand';

export type OfflineVersion = {
  displayName: string;
  url: string;
};

export type OfflineRepo = {
  displayName: string;
  subTitle?: string;
  versions: OfflineVersion[];
};

const defaultValues: {
  repos: OfflineRepo[];
} = {
  repos: [],
};

const OfflineDownloadContext = createContext(defaultValues);

/**
 * used to process docsets from graphql into OfflineRepo
 */
// function processDocsets(docsets: any) {
//   // TODO: process snooty graphql docsets on build time. different from snooty data api
//   return [];
// }

/**
 * used to process repos from snooty data api into OfflineRepo
 */
function processRepos(repos: Repo[]) {
  return repos.reduce((res: OfflineRepo[], repo) => {
    const offlineRepo: OfflineRepo = {
      displayName: assertLeadingBrand(repo?.search?.categoryTitle ?? repo.project),
      versions: [],
    };

    for (const branch of repo.branches) {
      if (branch.offlineUrl) {
        offlineRepo.versions.push({
          displayName: branch.label,
          url: branch.offlineUrl,
        });
      }
      // TODO: REMOVE TESTING
      else {
        offlineRepo.versions.push({
          displayName: branch.label,
          url: branch.fullUrl,
        });
      }
    }

    // only return this repo if it has offline versions
    if (offlineRepo.versions.length) {
      res.push(offlineRepo);
    }
    return res;
  }, []).sort((a, b) => a.displayName > b.displayName ? 1 : -1);
}

type ProviderProps = {
  children: JSX.Element[] | JSX.Element;
  modalOpen: boolean;
};

/**
 * Context Provider to contain offline repo(s) info
 * will download once when modal is opened
 *
 */
const OfflineDownloadProvider = ({ children, modalOpen }: ProviderProps) => {
  // const allDocsets = useAllDocsets();
  const [offlineRepos, setOfflineRepos] = useState<OfflineRepo[]>(() => {
    // TODO: use allDocsets to come up with initial offlineRepos
    return [];
  });
  const promise = useRef<Promise<void>>();

  useEffect(() => {
    if (promise.current || !modalOpen) {
      return;
    }

    promise.current = getAllRepos()
      .then((res) => {
        setOfflineRepos(processRepos(res));
        console.log('process the res here for populating offlineRepos');
      })
      .catch((e) => {
        console.error('Error while fetching repos, returning build data');
      });
  }, [modalOpen]);

  return <OfflineDownloadContext.Provider value={{ repos: offlineRepos }}>{children}</OfflineDownloadContext.Provider>;
};

const useOfflineDownloadContext = () => {
  return useContext(OfflineDownloadContext);
};

export { OfflineDownloadProvider, useOfflineDownloadContext };
