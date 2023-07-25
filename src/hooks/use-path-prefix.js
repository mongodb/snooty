import { useStaticQuery, graphql } from 'gatsby';

export const usePathPrefix = () => {
  const { site } = useStaticQuery(
    graphql`
      query PathPrefix {
        site {
          pathPrefix
        }
      }
    `
  );
  return site.pathPrefix;
};
