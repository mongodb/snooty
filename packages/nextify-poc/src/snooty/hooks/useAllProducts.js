import { useStaticQuery, graphql } from "../../gatsby-shim";

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
