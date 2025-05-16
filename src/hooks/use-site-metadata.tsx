import { useStaticQuery, graphql } from 'gatsby';
import { SiteMetadata } from '../types/data';

type SiteMetadataQueryResult = {
  site: {
    siteMetadata: SiteMetadata;
  };
};

export const useSiteMetadata = () => {
  const { site } = useStaticQuery<SiteMetadataQueryResult>(
    graphql`
      query SiteMetaData {
        site {
          siteMetadata {
            commitHash
            database
            parserBranch
            parserUser
            patchId
            pathPrefix
            project
            reposDatabase
            siteUrl
            snootyBranch
            snootyEnv
            user
          }
        }
      }
    `
  );
  return site.siteMetadata;
};
