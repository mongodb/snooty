import { graphql, useStaticQuery } from 'gatsby';
import { useEffect, useState } from 'react';

type AllProductsQueryResult = {
  allProduct: {
    nodes: {
      title: string;
      url: string;
    }[];
  };
};

export const useAllProducts = () => {
  const [products, setProducts] = useState<{ title: string; url: string }[]>([]);
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

  useEffect(() => {
    fetch(`${process.env.GATSBY_NEXT_API_BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(console.error);
  }, [allProduct]);

  return products.length > 0 ? products : allProduct.nodes;
};
