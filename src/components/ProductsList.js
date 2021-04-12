import React, { useEffect, useState } from 'react';
import { AnonymousCredential } from 'mongodb-stitch-browser-sdk';
import styled from '@emotion/styled';
import Icon from '@leafygreen-ui/icon';
import { uiColors } from '@leafygreen-ui/palette';
import Link from './Link';
import { SNOOTY_STITCH_ID } from '../build-constants';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { theme } from '../theme/docsTheme';
import { getStitchClient } from '../utils/stitch';

const LINE_HEIGHT = '20px';

const HeadingTitle = styled('span')`
  line-height: ${LINE_HEIGHT};
  padding-left: ${theme.size.small};
`;

const Products = styled(`ul`)`
  list-style-type: none;
  padding: 0;
`;

const ProductsListContainer = styled('div')`
  margin-top: ${theme.size.large};
  width: 100%;
`;

const ProductsListHeading = styled('div')`
  align-items: center;
  color: ${(props) => (props.isOpen ? uiColors.gray.dark3 : uiColors.gray.dark1)};
  cursor: pointer;
  display: flex;
  padding: 0px ${theme.size.medium};
  user-select: none;

  :hover {
    color: ${uiColors.gray.dark3};
  }
`;

const ProductLink = styled(Link)`
  color: ${uiColors.gray.dark2};
  display: inline-block;
  font-size: ${theme.fontSize.small};
  letter-spacing: 0;
  padding-left: 44px;
  padding-right: ${theme.size.medium};
  width: 100%;

  :hover {
    color: ${uiColors.gray.dark2};
    font-weight: bold;
    text-decoration: none;
  }
`;

const StyledIcon = styled(Icon)`
  height: 12px;
  width: 12px;
`;

const Product = styled('li')`
  line-height: ${LINE_HEIGHT};
  padding: ${theme.size.tiny} 0;

  @media ${theme.screenSize.upToSmall} {
    padding: ${theme.size.small} 0;
  }
`;

const ProductsList = () => {
  const { database } = useSiteMetadata();
  const [isOpen, setOpen] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      const client = getStitchClient(SNOOTY_STITCH_ID);
      await client.auth.loginWithCredential(new AnonymousCredential()).catch(console.error);
      const products = await client.callFunction('fetchAllProducts', [database]);
      setProducts(products);
    };
    fetchAllProducts();
  }, [database, setProducts]);

  return (
    <ProductsListContainer>
      <ProductsListHeading isOpen={isOpen} onClick={() => setOpen(!isOpen)}>
        <StyledIcon glyph={isOpen ? 'ChevronUp' : 'ChevronDown'} />
        <HeadingTitle>View all products</HeadingTitle>
      </ProductsListHeading>
      {isOpen && (
        <Products>
          {products.map(({ baseUrl, slug, title }, index) => {
            const productUrl = baseUrl + slug;
            return (
              <Product key={index}>
                <ProductLink to={productUrl}>{title}</ProductLink>
              </Product>
            );
          })}
        </Products>
      )}
    </ProductsListContainer>
  );
};

export default ProductsList;
