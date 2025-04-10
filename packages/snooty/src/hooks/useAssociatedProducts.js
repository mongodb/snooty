import { useStaticQuery, graphql } from 'gatsby';

// Return an array of MongoDB products
export const useAllAssociatedProducts = () => {
  const { allAssociatedProduct } = useStaticQuery(
    graphql`
      query AllAssociatedProducts {
        allAssociatedProduct {
          nodes {
            productName
          }
        }
      }
    `
  );
  return allAssociatedProduct.nodes.map((ap) => ap.productName);
};
