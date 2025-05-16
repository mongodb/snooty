import { useStaticQuery, graphql } from 'gatsby';

type AllAssociatedProductsQueryResult = {
  allAssociatedProduct: {
    nodes: {
      productName: string;
    }[];
  };
};

// Return an array of MongoDB products
export const useAllAssociatedProducts = () => {
  const { allAssociatedProduct } = useStaticQuery<AllAssociatedProductsQueryResult>(
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
