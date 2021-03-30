import { useEffect } from 'react';
import { useSiteMetadata } from './use-site-metadata';

const ENABLED_SITES = new Set(['cloud-docs', 'datalake', 'docs', 'guides', 'node', 'realm']);

export const useDelightedSurvey = (slug) => {
  const { parserBranch, project, snootyEnv } = useSiteMetadata();

  useEffect(() => {
    if (snootyEnv === 'production' && ENABLED_SITES.has(project)) {
      let projectName = project;
      if (project === 'docs') {
        projectName = 'manual';
      } else if (project === 'cloud-docs') {
        projectName = 'atlas';
      }

      window.delighted.survey({
        minTimeOnPage: 90,
        properties: {
          branch: parserBranch,
          project: projectName,
        },
      });
    }
  }, [parserBranch, project, slug, snootyEnv]);
};
