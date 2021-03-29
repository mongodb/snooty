import React from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import styled from '@emotion/styled';
import LeafyGreenCard from '@leafygreen-ui/card';
import ComponentFactory from '../ComponentFactory';
import Link from '../Link';
import Tag from '../Tag';

const StyledCard = styled(LeafyGreenCard)`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${({ theme }) => `${theme.size.large}`};
`;

const CardIcon = styled('img')`
  width: ${({ theme }) => `${theme.size.medium}`};
`;

const H4 = styled('h4')`
  letter-spacing: 0.5px;
  margin: ${({ theme }) => `${theme.size.medium} 0 ${theme.size.small} 0`};
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
    options: { cta, headline, icon, 'icon-alt': iconAlt, tag, url },
  },
}) => (
  <StyledCard
    onClick={() => {
      window.location.href = url;
    }}
  >
    {icon && <CardIcon src={withPrefix(icon)} alt={iconAlt} />}
    {tag && <FlexTag text={tag} />}
    <H4>{headline}</H4>
    {children.map((child, i) => (
      <ComponentFactory nodeData={child} key={i} />
    ))}
    <CTA to={url}>{cta}</CTA>
  </StyledCard>
);

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
