import { useStaticQuery, graphql } from 'gatsby';

// Return an array of MongoDB products
export const useNavigationParents = (project) => {
  const { allProjectParent } = useStaticQuery(
    graphql`
      query AllProjectParents {
        allProjectParent {
          nodes {
            parents
            project
          }
        }
      }
    `
  );
  const res = (allProjectParent?.nodes || []).filter((re) => re.project === project)[0];

  return res?.parents || [];
};
