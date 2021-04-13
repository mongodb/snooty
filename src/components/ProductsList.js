import React, { useState } from 'react';
import styled from '@emotion/styled';
import Icon from '@leafygreen-ui/icon';
import { uiColors } from '@leafygreen-ui/palette';
import Link from './Link';
import { useAllProducts } from '../hooks/useAllProducts';
import { theme } from '../theme/docsTheme';

const HeadingTitle = styled('span')`
  padding-left: ${theme.size.small};
`;

const Products = styled(`ul`)`
  list-style-type: none;
  padding: 0;
  ${(props) => !props.isOpen && 'display: none;'}
`;

const ProductsListContainer = styled('div')`
  line-height: 20px;
  margin-top: ${theme.size.large};
  width: 100%;
`;

const ProductsListHeading = styled('div')`
  align-items: center;
  color: ${(props) => (props.isOpen ? uiColors.gray.dark3 : uiColors.gray.dark1)};
  cursor: pointer;
  display: flex;
  padding: 0px ${theme.size.medium} 12px;
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
  padding: ${theme.size.tiny} ${theme.size.medium} ${theme.size.tiny} 44px;
  width: 100%;

  :hover {
    color: ${uiColors.gray.dark2};
    font-weight: bold;
    text-decoration: none;
  }

  @media ${theme.screenSize.upToSmall} {
    padding: ${theme.size.small} ${theme.size.medium} ${theme.size.small} 44px;
  }
`;

const StyledIcon = styled(Icon)`
  height: 12px;
  width: 12px;
`;

const ProductsList = () => {
  const products = useAllProducts();
  const [isOpen, setOpen] = useState(false);

  return (
    <ProductsListContainer>
      <ProductsListHeading isOpen={isOpen} onClick={() => setOpen(!isOpen)}>
        <StyledIcon glyph={isOpen ? 'ChevronUp' : 'ChevronDown'} />
        <HeadingTitle>View all products</HeadingTitle>
      </ProductsListHeading>
      <Products isOpen={isOpen}>
        {products.map(({ title, url }, index) => {
          return (
            <li key={index}>
              <ProductLink to={url}>{title}</ProductLink>
            </li>
          );
        })}
      </Products>
    </ProductsListContainer>
  );
};

export default ProductsList;
