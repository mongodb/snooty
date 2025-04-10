import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { palette } from '@leafygreen-ui/palette';
import { css } from '@leafygreen-ui/emotion';
import { withPrefix } from 'gatsby';
import { theme } from '../../theme/docsTheme';
import ComponentFactory from '../ComponentFactory';
import SectionHeader from '../SectionHeader';

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
    color: var(--color);
    font-size: ${FONT_SIZE};
    font-weight: normal;
  }
`;

const customStyleHeader = css`
  padding-top: 4px;
`;

const ProductItem = ({ nodeData: { children, options, argument } }) => {
  const icon = options.icon;
  const iconAlt = options['icon-alt'];
  const { darkMode } = useDarkMode();
  return (
    <StyledSection>
      <img src={withPrefix(icon)} alt={iconAlt} height={HEIGHT} width={WIDTH} />
      <StyledArticle style={{ '--color': darkMode ? palette.blue.light1 : palette.blue.base }}>
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
