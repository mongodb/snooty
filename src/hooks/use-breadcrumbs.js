import { useStaticQuery, graphql } from 'gatsby';

// Return an array of MongoDB products
export const useBreadcrumbs = () => {
  const { allBreadcrumb } = useStaticQuery(
    graphql`
      query AllBreadcrumbs {
        allBreadcrumb {
          nodes {
            project
            breadcrumbs
            propertyUrl
          }
        }
      }
    `
  );

  // const res = (allBreadcrumb?.nodes || []).find((re) => re.project === project);
  return allBreadcrumb?.nodes || [];
};
