import { useStaticQuery, graphql } from 'gatsby';

export const useSiteMetadata = () => {
  const { site } = useStaticQuery(
    graphql`
      query SiteMetaData {
        site {
          siteMetadata {
            parserBranch
            project
            snootyBranch
            title
            user
          }
        }
      }
    `
  );
  return site.siteMetadata;
};
