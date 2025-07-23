import { useContext, useMemo } from 'react';
import { VersionContext } from '../context/version-context';
import useSnootyMetadata from '../utils/use-snooty-metadata';
import { Versions } from '../types/versions';
import { useCurrentUrlSlug } from './use-current-url-slug';
import { useSiteMetadata } from './use-site-metadata';

export const useIsValidVersion = () => {
  const { availableVersions } = useContext(VersionContext);
  const { parserBranch } = useSiteMetadata();
  const { project } = useSnootyMetadata();
  const branches: Versions = useMemo(() => {
    return availableVersions[project as keyof typeof availableVersions];
  }, [project, availableVersions]);
  const currentUrlSlug = useCurrentUrlSlug(parserBranch, branches);

  // using useMemo to cache th result if
  // available versions, project and currentSlug didn't change
  const isValid = useMemo(() => {
    // No version in URL, treat as a valid version
    if (!currentUrlSlug) return true;

    return branches.some((b) => {
      // checking for three possible ways to look for the version name
      return (
        b.urlSlug === currentUrlSlug ||
        (b.urlAliases && b.urlAliases.includes(currentUrlSlug)) ||
        b.gitBranchName === currentUrlSlug
      );
    });
  }, [currentUrlSlug, branches]);

  return isValid;
};
