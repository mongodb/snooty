import { useStaticQuery, graphql } from 'gatsby';

// Return an array of MongoDB products
export const useAllProducts = () => {
  const { allProduct } = useStaticQuery(
    graphql`
      query AllProducts {
        allProduct {
          nodes {
            title
            url
          }
        }
      }
    `
  );
  return allProduct.nodes;
};
