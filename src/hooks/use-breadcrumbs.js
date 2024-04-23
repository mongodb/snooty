import { useStaticQuery, graphql } from 'gatsby';

// Return an array of MongoDB products
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

  return allBreadcrumb?.nodes || [];
};
