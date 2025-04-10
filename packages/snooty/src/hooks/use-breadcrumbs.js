import { useStaticQuery, graphql } from 'gatsby';

// Return an array containing the project property's Url and any intermediate breadcrumbs
export const useBreadcrumbs = () => {
  const { allBreadcrumb } = useStaticQuery(
    graphql`
      query AllBreadcrumbs {
        allBreadcrumb {
          nodes {
            breadcrumbs
            propertyUrl
          }
        }
      }
    `
  );

  return allBreadcrumb?.nodes[0] || [];
};
