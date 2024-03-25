import { useStaticQuery, graphql } from 'gatsby';

export const useSiteMetadata = () => {
  const { site } = useStaticQuery(
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
