import { useStaticQuery, graphql } from 'gatsby';

type AllBreadcrumbsQueryResult = {
  allBreadcrumb: {
    nodes: {
      breadcrumbs: {
        title: string;
        path: string;
      }[];
      propertyUrl: string;
    }[];
  };
};

// Return an array containing the project property's Url and any intermediate breadcrumbs
export const useBreadcrumbs = () => {
  const { allBreadcrumb } = useStaticQuery<AllBreadcrumbsQueryResult>(
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
