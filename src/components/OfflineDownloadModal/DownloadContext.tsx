import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react';
import { useAllDocsets } from '../../hooks/useAllDocsets';
import { getAllRepos, type Repo } from '../../utils/snooty-data-api';
import assertLeadingBrand from '../../utils/assert-leading-brand';
import useScreenSize from '../../hooks/useScreenSize';
import DownloadModal from './DownloadModal';

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
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
} = {
  repos: [],
  modalOpen: false,
  setModalOpen: () => {},
};

const OfflineDownloadContext = createContext(defaultValues);

function lintVersionLabel(versionLabel: string) {
  return versionLabel.toLowerCase();
}

/**
 * used to process docsets from graphql into OfflineRepo
 */
function processDocsets(docsets: any): OfflineRepo[] {
  return docsets.reduce((offlineRepos: OfflineRepo[], docset: any) => {
    if (!docset.displayName || !docset.branches) {
      return offlineRepos;
    }

    const offlineRepo: OfflineRepo = {
      displayName: assertLeadingBrand(docset.displayName),
      versions: [],
    };

    for (const branch of docset.branches) {
      if (branch.active && branch.offlineUrl) {
        offlineRepo.versions.push({
          displayName: lintVersionLabel(branch.versionSelectorLabel),
          url: branch.offlineUrl,
        });
      }
    }

    if (offlineRepo.versions.length) {
      offlineRepos.push(offlineRepo);
    }
    return offlineRepos;
  }, []);
}

/**
 * used to process repos from snooty data api into OfflineRepo
 */
function processRepos(repos: Repo[]) {
  return repos
    .reduce((res: OfflineRepo[], repo) => {
      const offlineRepo: OfflineRepo = {
        displayName: assertLeadingBrand(repo.displayName ?? repo?.search?.categoryTitle ?? repo.project, {
          titleCase: true,
        }),
        versions: [],
      };

      for (const branch of repo.branches) {
        // only show branches that are active
        // and have an offline url
        if (!branch.active) {
          continue;
        }
        if (branch.offlineUrl) {
          offlineRepo.versions.push({
            displayName: lintVersionLabel(branch.label),
            url: branch.offlineUrl,
          });
        }
      }

      // only return this repo if it has offline versions
      if (offlineRepo.versions.length) {
        res.push(offlineRepo);
      }
      return res;
    }, [])
    .sort((a, b) => (a.displayName > b.displayName ? 1 : -1));
}

type ProviderProps = {
  children: JSX.Element[] | JSX.Element;
};

/**
 * Context Provider to contain offline repo(s) info
 * will download once when modal is opened
 *
 */
const OfflineDownloadProvider = ({ children }: ProviderProps) => {
  const allDocsets = useAllDocsets();
  const [offlineRepos, setOfflineRepos] = useState<OfflineRepo[]>(() => processDocsets(allDocsets));
  const [modalOpen, setModalOpen] = useState(() => false);
  const promise = useRef<Promise<void>>();
  const { isTabletOrMobile } = useScreenSize();

  useEffect(() => {
    if (promise.current || !modalOpen) {
      return;
    }

    let isMounted = true;
    promise.current = getAllRepos()
      .then((res) => {
        if (!isMounted) return;
        setOfflineRepos(processRepos(res));
      })
      .catch((e) => {
        console.error('Error while fetching repos, returning build data');
      })
      .finally(() => {
        promise.current = undefined;
      });

    return () => {
      isMounted = false;
    };
  }, [modalOpen]);

  useEffect(() => {
    if (isTabletOrMobile) {
      setModalOpen(false);
    }
  }, [isTabletOrMobile]);

  return (
    <OfflineDownloadContext.Provider value={{ repos: offlineRepos, modalOpen, setModalOpen }}>
      {children}
      {!isTabletOrMobile && <DownloadModal open={modalOpen} setOpen={setModalOpen} />}
    </OfflineDownloadContext.Provider>
  );
};

const useOfflineDownloadContext = () => {
  return useContext(OfflineDownloadContext);
};

export { OfflineDownloadProvider, useOfflineDownloadContext };
