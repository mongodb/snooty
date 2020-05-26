import React from 'react';
import { withPrefix } from 'gatsby';
import styled from '@emotion/styled';
import Box from '@leafygreen-ui/box';
import LeafyGreenCard from '@leafygreen-ui/card';
import ComponentFactory from '../ComponentFactory';
import Link from '../Link';
import Tag from '../Tag';

const AnchorBox = styled(Box)`
  color: #494747;

  &:hover {
    color: #494747;
    text-decoration: none !important;
  }
`;

// TODO: should padding be based on size?
// Cards that appear in 2 columns have more x padding
const StyledCard = styled(LeafyGreenCard)`
  padding: ${({ theme }) => `${theme.size.large}`};
`;

const CardIcon = styled('img')`
  margin: -4px 0 -4px 0;
  width: ${({ theme }) => `${theme.size.large}`};
`;

const Card = ({
  nodeData: {
    children,
    options: { cta, headline, icon, 'icon-alt': iconAlt, tag, url },
  },
}) => {
  console.log(icon);
  console.log(withPrefix(icon));
  return (
    <AnchorBox href={url}>
      <StyledCard>
        {icon && <CardIcon src={withPrefix(icon)} alt={iconAlt} />}
        {tag && <Tag text={tag} />}
        <h4>{headline}</h4>
        {children.map((child, i) => (
          <ComponentFactory nodeData={child} key={i} />
        ))}
        <Link to={url}>
          <strong>{cta}</strong>
        </Link>
      </StyledCard>
    </AnchorBox>
  );
};

export default Card;
