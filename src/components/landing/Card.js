import React from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import styled from '@emotion/styled';
import LeafyGreenCard from '@leafygreen-ui/card';
import ComponentFactory from '../ComponentFactory';
import ConditionalWrapper from '../ConditionalWrapper';
import Link from '../Link';
import Tag from '../Tag';

const StyledCard = styled(LeafyGreenCard)`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${({ theme }) => `${theme.size.large}`};

  p:last-of-type {
    margin-bottom: 0;
  }
`;

const CardIcon = styled('img')`
  width: ${({ theme }) => `${theme.size.medium}`};
`;

const H4 = styled('h4')`
  letter-spacing: 0.5px;
  margin: ${({ compact, theme }) =>
    compact ? `0 0 ${theme.size.small}` : `${theme.size.medium} 0 ${theme.size.small} 0`};
`;

const CTA = styled('p')`
  font-weight: bold;
  margin-top: auto;
`;

const FlexTag = styled(Tag)`
  margin-right: auto;
`;

const CompactCard = styled(StyledCard)`
  align-items: flex-start;
  display: flex;
  flex-direction: row;
`;

const CompactWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-left: ${({ theme }) => theme.size.default};
`;

const Card = ({
  isCompact,
  isExtraCompact,
  nodeData: {
    children,
    options: { cta, headline, icon, 'icon-alt': iconAlt, tag, url },
  },
}) => {
  const Card = isCompact || isExtraCompact ? CompactCard : StyledCard;
  return (
    <Card
      onClick={() => {
        window.location.href = url;
      }}
    >
      {icon && <CardIcon src={withPrefix(icon)} alt={iconAlt} />}
      <ConditionalWrapper
        condition={isCompact || isExtraCompact}
        wrapper={(children) => <CompactWrapper>{children}</CompactWrapper>}
      >
        {tag && <FlexTag text={tag} />}
        <H4 compact={isCompact || isExtraCompact}>{headline}</H4>
        {children.map((child, i) => (
          <ComponentFactory nodeData={child} key={i} />
        ))}
        {cta && (
          <CTA>
            <Link to={url}>{cta}</Link>
          </CTA>
        )}
      </ConditionalWrapper>
    </Card>
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
