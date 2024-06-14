import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import { Global, css } from '@emotion/react';
import styled from '@emotion/styled';
import { css as LeafyCSS, cx } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import { palette } from '@leafygreen-ui/palette';
import Link from '../Link';
import { useAllProducts } from '../../hooks/useAllProducts';
import { theme } from '../../theme/docsTheme';

const chevronRotationDuration = '200ms';

const openTransition = css`
  transition: all 300ms ease-in-out ${chevronRotationDuration};
`;

const transitionClasses = css`
  .products-list-enter {
    display: block !important;
    margin-top: -100vh;
  }
  .products-list-enter-active {
    display: block !important;
    margin-top: 0;
    ${openTransition}
  }
  .products-list-enter-done {
    display: block !important;
  }
  .products-list-exit {
    display: block !important;
    margin-top: 0;
  }
  .products-list-exit-active {
    display: block !important;
    margin-top: -100vh;
    ${openTransition}
  }
`;

const HeadingTitle = styled('span')`
  padding-left: ${theme.size.small};
  font-size: ${theme.fontSize.small};
`;

const Products = styled(`ul`)`
  display: none;
  background-color: var(--background-color);
  list-style-type: none;
  padding: 0;
  li > a {
    line-height: ${theme.size.medium};
  }
`;

const ProductsListContainer = styled('div')`
  line-height: 20px;
  width: 100%;
`;

const ProductsListHeading = styled('div')`
  align-items: center;
  background-color: var(--background-color);
  color: var(--color);
  cursor: pointer;
  display: flex;
  padding: ${theme.size.default} ${theme.size.medium} 12px;
  position: relative;
  user-select: none;
  z-index: 1;

  :hover {
    color: var(--hover-color);
  }
`;

const ProductLink = styled(Link)`
  color: var(--color);
  display: inline-block;
  font-size: ${theme.fontSize.small};
  letter-spacing: 0;
  padding: ${theme.size.tiny} ${theme.size.medium} ${theme.size.tiny} 44px;
  width: 100%;

  :hover {
    color: var(--hover-color);
    font-weight: bold;
    text-decoration: none;
  }

  :focus {
    text-decoration: none;
  }

  @media ${theme.screenSize.upToSmall} {
    padding: ${theme.size.small} ${theme.size.medium} ${theme.size.small} 44px;
  }
`;

const iconStyle = ({ isOpen }) => LeafyCSS`
  height: 12px;
  width: 12px;

  transform: rotate(${isOpen ? 0 : -180}deg);
  transition: transform ${chevronRotationDuration};
`;

const getProductListHeadingDynamicStyles = (darkMode, isOpen) => {
  const darkThemeColor = isOpen ? palette.gray.light2 : palette.gray.light1;
  const lightThemeColor = isOpen ? palette.gray.dark3 : palette.gray.dark1;
  return {
    '--color': darkMode ? darkThemeColor : lightThemeColor,
    '--background-color': darkMode ? palette.gray.dark4 : palette.gray.light3,
    '--hover-color': darkMode ? palette.gray.light2 : palette.gray.dark3,
  };
};

const ProductsList = ({ darkMode }) => {
  const products = useAllProducts();
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Global styles={transitionClasses} />
      <ProductsListContainer>
        <ProductsListHeading
          style={getProductListHeadingDynamicStyles(darkMode, isOpen)}
          onClick={() => setOpen(!isOpen)}
        >
          <Icon className={cx(iconStyle({ isOpen }))} glyph="ChevronUp" />
          <HeadingTitle>View all products</HeadingTitle>
        </ProductsListHeading>
      </ProductsListContainer>
      <CSSTransition
        in={isOpen}
        classNames="products-list"
        addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
      >
        <Products>
          {products.map(({ title, url }, index) => {
            return (
              <li key={index}>
                <ProductLink
                  style={{
                    '--color': darkMode ? palette.gray.light1 : palette.black,
                    '--hover-color': darkMode ? palette.gray.light2 : palette.gray.dark2,
                  }}
                  to={url}
                >
                  {title}
                </ProductLink>
              </li>
            );
          })}
        </Products>
      </CSSTransition>
    </>
  );
};

ProductsList.propTypes = {
  darkMode: PropTypes.bool,
};

export default ProductsList;
