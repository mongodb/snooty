import { useStaticQuery, graphql } from 'gatsby';

export const useSiteMetadata = () => {
  const { site } = useStaticQuery(
    graphql`
      query SiteMetaData {
        site {
          siteMetadata {
            branch
            project
            title
            user
          }
        }
      }
    `
  );
  return site.siteMetadata;
};
