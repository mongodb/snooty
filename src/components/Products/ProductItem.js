import React from 'react';
import styled from '@emotion/styled';
import { withPrefix } from 'gatsby';
import { theme } from '../../theme/docsTheme';
import ComponentFactory from '../ComponentFactory';

const FONT_SIZE = '16px';

const StyledSection = styled.div`
  margin-bottom: 34px;

  @media ${theme.screenSize.mediumAndUp} {
    align-items: flex-start;
    column-gap: 38px;
    display: flex;
    width: 90vw;
  }

  @media ${theme.screenSize.largeAndUp} {
    width: 58vw;
  }
`;

const StyledImage = styled.img`
  width: 61px;
`;

const StyledArticle = styled.article`
  h2 {
    margin-top: 2px;
  }
  p:first-of-type {
    font-size: 24px;
    font-weight: 500;
  }
  p {
    font-size: ${FONT_SIZE};
    line-height: 28px;
    margin-bottom: 8px;
    margin-top: 12px;
  }

  a {
    font-size: ${FONT_SIZE};
    font-weight: normal;
  }
`;

const ProductItem = ({
  nodeData: {
    children,
    options: { icon },
  },
}) => {
  console.log('children-->', children);
  return (
    <StyledSection>
      <StyledImage src={withPrefix(icon)} alt="Atlas" />
      <StyledArticle>
        {children.map((child, i) => (
          <ComponentFactory nodeData={child} key={i} />
        ))}
      </StyledArticle>
    </StyledSection>
  );
};

export default ProductItem;
