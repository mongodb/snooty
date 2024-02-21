import { useStaticQuery, graphql } from 'gatsby';

// Return an array of MongoDB products
export const useNavigationParents = () => {
  const { allProjectParent } = useStaticQuery(
    graphql`
      query AllProjectParents {
        allProjectParent {
          nodes {
            title
            url
          }
        }
      }
    `
  );
  console.log('check allprojectparents');
  console.log(allProjectParent);
  return allProjectParent.nodes;
};
