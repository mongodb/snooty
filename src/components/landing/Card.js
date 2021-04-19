import React from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import styled from '@emotion/styled';
import Box from '@leafygreen-ui/box';
import LeafyGreenCard from '@leafygreen-ui/card';
import { theme } from '../../theme/docsTheme';
import ComponentFactory from '../ComponentFactory';
import Link from '../Link';
import Tag from '../Tag';

const StyledCard = styled(LeafyGreenCard)`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${theme.size.large};
`;

const CompactCard = styled(LeafyGreenCard)`
  padding: ${theme.size.large};
`;

const CardIcon = styled('img')`
  width: ${theme.size.medium};
`;

const CompactIcon = styled('img')`
  width: 48px;
`;

const H4 = styled('h4')`
  letter-spacing: 0.5px;
  margin: ${theme.size.medium} 0 ${theme.size.small} 0;
`;

const CTA = styled(Link)`
  font-weight: bold;
  margin-top: auto;
  margin-bottom: 0;
`;

const FlexTag = styled(Tag)`
  margin-right: auto;
`;

const Card = ({
  nodeData: {
    children,
    options: { cta, headline, icon, style, 'icon-alt': iconAlt, tag, url },
  },
  page,
}) => {
  // CHECK ON STYLE NOT ON TEMPLATE
  const isCompact = style === 'product-landing';
  console.log(isCompact);
  return (
    <Box href={url}>
      <>
        {isCompact ? (
          <CompactCard>
            {icon && <CompactIcon src={withPrefix(icon)} alt={iconAlt} />}
            {tag && <FlexTag text={tag} />}
            <H4>{headline}</H4>
            {children.map((child, i) => (
              <ComponentFactory nodeData={child} key={i} />
            ))}
            <CTA to={url}>{cta}</CTA>
          </CompactCard>
        ) : (
          <StyledCard>
            {icon && <CardIcon src={withPrefix(icon)} alt={iconAlt} />}
            {tag && <FlexTag text={tag} />}
            <H4>{headline}</H4>
            {children.map((child, i) => (
              <ComponentFactory nodeData={child} key={i} />
            ))}
            <CTA to={url}>{cta}</CTA>
          </StyledCard>
        )}
      </>
    </Box>
  );
};

Card.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object),
    options: PropTypes.shape({
      cta: PropTypes.string,
      headline: PropTypes.string,
      icon: PropTypes.string,
      'icon-alt': PropTypes.string,
      tag: PropTypes.string,
      url: PropTypes.string,
    }),
  }).isRequired,
};

export default Card;
