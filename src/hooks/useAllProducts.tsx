import { useEffect, useState } from 'react';

export const useAllProducts = () => {
  const [products, setProducts] = useState<{ title: string; url: string }[]>([]);

  useEffect(() => {
    fetch(`${process.env.GATSBY_NEXT_API_BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(console.error);
  }, []);

  return products;
};
