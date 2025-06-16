import React from 'react';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { css } from '@leafygreen-ui/emotion';
import { withPrefix } from 'gatsby';
import { theme } from '../../theme/docsTheme';
import ComponentFactory from '../ComponentFactory';
import SectionHeader from '../SectionHeader';
import { Directive } from '../../types/ast';

// Keeping these types here as this component is not currently in use (easy to delete in future)
type ProductItemNodeOptions = {
  icon: string;
  'icon-alt': string;
};

interface ProductItemNode extends Directive<ProductItemNodeOptions> {
  options: ProductItemNodeOptions;
}

const FONT_SIZE = theme.fontSize.default;
const HEIGHT = '61px';
const WIDTH = '61px';

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

const StyledArticle = styled.article`
  p {
    font-size: ${FONT_SIZE};
    line-height: 28px;
    margin-bottom: 8px;
    margin-top: 12px;
  }

  a {
    color: ${palette.blue.base};
    font-size: ${FONT_SIZE};
    font-weight: normal;

    .dark-theme & {
      color: ${palette.blue.light1};
    }
  }
`;

const customStyleHeader = css`
  padding-top: 4px;
`;

export type ProductItemProps = {
  nodeData: ProductItemNode;
};

const ProductItem = ({ nodeData: { children, options, argument } }: ProductItemProps) => {
  const icon = options.icon;
  const iconAlt = options['icon-alt'];
  return (
    <StyledSection>
      <img src={withPrefix(icon)} alt={iconAlt} height={HEIGHT} width={WIDTH} />
      <StyledArticle>
        <SectionHeader customStyles={customStyleHeader}>
          {argument.map((child, i) => (
            <ComponentFactory nodeData={child} key={i} />
          ))}
        </SectionHeader>
        {children.map((child, i) => (
          <ComponentFactory nodeData={child} key={i} showLinkArrow={true} />
        ))}
      </StyledArticle>
    </StyledSection>
  );
};

export default ProductItem;
