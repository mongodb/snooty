import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import { theme } from '../../theme/docsTheme';
import ComponentFactory from '../ComponentFactory';
import SectionHeader from '../SectionHeader';

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
  height: 61px;
  width: 61px;
`;

const StyledArticle = styled.article`
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

const StyledSectionHeader = styled(SectionHeader)`
  padding-top: 4px;
`;

const ProductItem = ({ nodeData: { children, options, argument } }) => {
  const icon = options.icon;
  const iconAlt = options['icon-alt'];
  return (
    <StyledSection>
      <StyledImage src={withPrefix(icon)} alt={iconAlt} />
      <StyledArticle>
        <StyledSectionHeader as="h3">
          {argument.map((child, i) => (
            <ComponentFactory nodeData={child} key={i} />
          ))}
        </StyledSectionHeader>
        {children.map((child, i) => (
          <ComponentFactory nodeData={child} key={i} showLinkArrow={true} />
        ))}
      </StyledArticle>
    </StyledSection>
  );
};

ProductItem.prototype = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    options: PropTypes.shape({
      columns: PropTypes.number,
    }),
    argument: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default ProductItem;
