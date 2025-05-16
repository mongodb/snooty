import { useStaticQuery, graphql } from 'gatsby';

type AllProductsQueryResult = {
  allProduct: {
    nodes: {
      title: string;
      url: string;
    }[];
  };
};

// Return an array of MongoDB products
export const useAllProducts = () => {
  const { allProduct } = useStaticQuery<AllProductsQueryResult>(
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
