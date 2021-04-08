import React, { useEffect, useState } from 'react';
import { Stitch, AnonymousCredential } from 'mongodb-stitch-browser-sdk';
import styled from '@emotion/styled';
import Icon from '@leafygreen-ui/icon';
import { uiColors } from '@leafygreen-ui/palette';
import Link from './Link';
import { SNOOTY_STITCH_ID } from '../build-constants';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { theme } from '../theme/docsTheme';

const ICON_SIZE = '12px';
const TITLE_SIZE = '20px';

const HeadingTitle = styled('span')`
  color: ${(props) => (props.isOpen ? uiColors.gray.dark3 : uiColors.gray.dark1)};
  line-height: ${TITLE_SIZE};
  padding-left: ${theme.size.small};
`;

const Products = styled(`ul`)`
  grid-column: 2;
  list-style-type: none;
  padding: 0;
`;

const ProductsListContainer = styled('div')`
  display: grid;
  grid-gap: ${theme.size.small};
  grid-template-columns: ${ICON_SIZE} 1fr;
  grid-template-rows: ${TITLE_SIZE} 1fr;
  padding-left: ${theme.size.medium};
  padding-top: ${theme.size.large};
  width: 100%;
`;

const ProductsListHeading = styled('div')`
  align-items: center;
  cursor: pointer;
  display: flex;
  grid-column: 1 / -1;
  user-select: none;

  :hover {
    ${HeadingTitle} {
      color: ${uiColors.gray.dark3};
    }
  }
`;

const ProductLink = styled(Link)`
  color: ${uiColors.gray.dark2};
  display: inline-block;
  letter-spacing: 0;
  width: 100%;

  :hover {
    color: ${uiColors.gray.dark2};
    font-weight: bold;
    text-decoration: none;
  }
`;

const StyledIcon = styled(Icon)`
  height: ${ICON_SIZE};
  width: ${ICON_SIZE};
`;

const Product = styled('li')`
  line-height: 20px;
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
      // TODO: Update this to use the stitch util function after merging DOP-1842
      const client = Stitch.hasAppClient(SNOOTY_STITCH_ID)
        ? Stitch.getAppClient(SNOOTY_STITCH_ID)
        : Stitch.initializeAppClient(SNOOTY_STITCH_ID);
      await client.auth.loginWithCredential(new AnonymousCredential()).catch(console.error);
      const products = await client.callFunction('fetchAllProducts', [database]);
      setProducts(products);
    };
    fetchAllProducts();
  }, [database, setProducts]);

  return (
    <ProductsListContainer>
      <ProductsListHeading onClick={() => setOpen(!isOpen)}>
        <StyledIcon glyph={isOpen ? 'ChevronUp' : 'ChevronDown'} />
        <HeadingTitle isOpen={isOpen}>View all products</HeadingTitle>
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
