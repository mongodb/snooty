import { useMemo, useContext } from 'react';
import useSnootyMetadata from '../utils/use-snooty-metadata';
import { VersionContext } from '../context/version-context';
import { TocItem } from '../components/UnifiedSidenav/types';
import { ActiveVersions, AvailableVersions } from '../context/version-context';
import { useUnifiedToc } from './use-unified-toc';

interface UpdateURLsParams {
  tree?: TocItem[];
  contentSite?: string;
  activeVersions: ActiveVersions;
  versionsData: AvailableVersions;
  project: string;
}

// Replace version variable in URL with current version
const updateURLs = ({ tree, contentSite, activeVersions, versionsData, project }: UpdateURLsParams): TocItem[] => {
  return (
    tree?.map((item) => {
      let newUrl = item.url ?? '';
      const currentProject = item.contentSite ?? contentSite;

      // Replace version variable with the true current version
      if (item?.url?.includes(':version') && currentProject) {
        const version = (versionsData[currentProject] || []).find(
          (version) =>
            version.gitBranchName === activeVersions[currentProject] ||
            version.urlSlug === activeVersions[currentProject] ||
            version?.urlAliases?.includes(activeVersions[currentProject])
        );
        // If no version found in local storage use 'current'
        const currentVersion = version?.urlSlug ?? 'current';
        newUrl = item.url!.replace(/:version/g, currentVersion);
      }

      const items = updateURLs({
        tree: item.items,
        contentSite: currentProject,
        activeVersions,
        versionsData,
        project,
      });

      return {
        ...item,
        newUrl,
        items,
        contentSite: currentProject,
      } as TocItem;
    }) ?? []
  );
};

// Hook that returns the processed unified TOC tree with updated URLs (version replacements)
export const useProcessedUnifiedToc = () => {
  const unifiedTocTree = useUnifiedToc();
  const { project } = useSnootyMetadata();
  const { activeVersions, availableVersions } = useContext(VersionContext);

  const processedTree = useMemo(() => {
    return updateURLs({
      tree: unifiedTocTree,
      activeVersions,
      versionsData: availableVersions,
      project,
    });
  }, [unifiedTocTree, activeVersions, availableVersions, project]);

  return processedTree;
};
